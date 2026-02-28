import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  value?: string;
}

export default function AudioRecorder({ onRecordingComplete, value }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(value || null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioURL && audioURL.startsWith('blob:')) {
        URL.revokeObjectURL(audioURL);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        // Revoke old URL if exists
        if (audioURL && audioURL.startsWith('blob:')) {
          URL.revokeObjectURL(audioURL);
        }
        
        setAudioURL(url);
        onRecordingComplete(blob);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to access microphone. Please check permissions.');
      console.error('Microphone access error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const deleteRecording = () => {
    if (audioURL && audioURL.startsWith('blob:')) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    onRecordingComplete(new Blob());
    toast.info('Recording deleted');
  };

  return (
    <div className="space-y-3">
      {audioURL ? (
        <div className="space-y-2">
          <audio src={audioURL} controls className="w-full" />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={deleteRecording} className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={startRecording} className="flex-1" disabled={isRecording}>
              <Mic className="h-4 w-4 mr-2" />
              Re-record
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          onClick={isRecording ? stopRecording : startRecording}
          className="w-full"
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>
      )}
    </div>
  );
}
