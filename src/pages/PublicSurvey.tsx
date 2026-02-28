import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { submitResponse } from '@/store/responseSlice';
import { responseService } from '@/services/responseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AudioRecorder from '@/components/AudioRecorder';
import { BaseUrl } from '@/config/BaseUrl';
import { Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicSurvey() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((state) => state.response);
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    fetch(`${BaseUrl}/surveys/public/${id}`)
      .then(res => res.json())
      .then(data => {
        setSurvey(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const getLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast.success('Location captured successfully');
          setGettingLocation(false);
        },
        () => {
          toast.error('Failed to get location');
          setGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocation not supported');
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (survey.requiresLocationValidation && !location) {
      toast.error('Please capture your location before submitting');
      return;
    }

    // Validate required questions
    for (const q of survey.questions) {
      if (q.isRequired && !answers[q.id]) {
        toast.error(`Please answer: ${q.questionText}`);
        return;
      }
    }

    // Process responses
    const responses = survey.questions.map((q: any) => {
      const answer = answers[q.id];
      
      if (q.type === 'multiple_choice' && Array.isArray(answer)) {
        return { questionId: q.id, answer: answer.join(', ') };
      }
      
      return { questionId: q.id, answer: answer || '' };
    });

    try {
      // Step 1: Submit response without audio
      const result = await dispatch(submitResponse({ 
        surveyId: id!, 
        responses,
        accessToken: answers['accessToken']
      })).unwrap();
      const responseId = result.data?.id;

      if (!responseId) {
        throw new Error('Response ID not received');
      }

      // Step 2: Upload single audio file for entire survey
      const token = localStorage.getItem('token') || '';
      const audioBlob = answers['survey_audio'];
      
      if (audioBlob instanceof Blob && audioBlob.size > 0) {
        await responseService.uploadAudio(token, responseId, audioBlob);
      }

      toast.success('Survey submitted successfully!');
      setAnswers({});
      setLocation(null);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit survey');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Survey not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{survey.title}</CardTitle>
            {survey.description && (
              <CardDescription className="text-base">{survey.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {survey.requiresLocationValidation && (
              <Card className="mb-6 bg-primary/5 border-primary">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Location Required
                      <span className="text-destructive">*</span>
                    </Label>
                    {location ? (
                      <div className="space-y-2">
                        <p className="text-sm font-mono bg-muted p-2 rounded">
                          Latitude: {location.latitude.toFixed(6)}
                        </p>
                        <p className="text-sm font-mono bg-muted p-2 rounded">
                          Longitude: {location.longitude.toFixed(6)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Click the button below to capture your current location</p>
                    )}
                    <Button
                      type="button"
                      onClick={getLocation}
                      disabled={gettingLocation}
                      variant={location ? "outline" : "default"}
                      className="w-full"
                    >
                      {gettingLocation ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Getting Location...
                        </>
                      ) : location ? (
                        'Update Location'
                      ) : (
                        'Capture Location'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-base font-medium">Access Token <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Enter access token"
                  value={answers['accessToken'] || ''}
                  onChange={(e) => setAnswers({ ...answers, accessToken: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Audio Response (Optional)</Label>
                <AudioRecorder
                  value={answers['survey_audio']}
                  onRecordingComplete={(blob) => setAnswers({ ...answers, survey_audio: blob })}
                />
              </div>

              {survey.questions?.map((q: any, i: number) => (
                <div key={q.id} className="space-y-3">
                  <Label className="text-base font-medium">
                    {i + 1}. {q.questionText}
                    {q.isRequired && <span className="text-destructive ml-1">*</span>}
                  </Label>

                  {q.type === 'text' && (
                    <Input
                      placeholder="Your answer"
                      className="mt-2"
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      required={q.isRequired}
                    />
                  )}

                  {q.type === 'textarea' && (
                    <Textarea
                      placeholder="Your answer"
                      rows={4}
                      className="mt-2"
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      required={q.isRequired}
                    />
                  )}

                  {q.type === 'rating' && (
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Button
                          key={n}
                          type="button"
                          variant={answers[q.id] === n ? 'default' : 'outline'}
                          className="w-12 h-12"
                          onClick={() => setAnswers({ ...answers, [q.id]: n })}
                        >
                          {n}
                        </Button>
                      ))}
                    </div>
                  )}

                  {q.type === 'single_choice' && (
                    <RadioGroup
                      className="space-y-2 mt-2"
                      value={answers[q.id]}
                      onValueChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                    >
                      {q.options?.map((opt: any) => (
                        <div key={opt.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.optionText} id={opt.id} />
                          <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                            {opt.optionText}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {q.type === 'multiple_choice' && (
                    <div className="space-y-2 mt-2">
                      {q.options?.map((opt: any) => (
                        <div key={opt.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={opt.id}
                            checked={(answers[q.id] || []).includes(opt.optionText)}
                            onCheckedChange={(checked) => {
                              const current = answers[q.id] || [];
                              setAnswers({
                                ...answers,
                                [q.id]: checked
                                  ? [...current, opt.optionText]
                                  : current.filter((v: string) => v !== opt.optionText)
                              });
                            }}
                          />
                          <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                            {opt.optionText}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'date' && (
                    <Input
                      type="date"
                      className="mt-2"
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      required={q.isRequired}
                    />
                  )}

                  {q.type === 'file' && (
                    <Input
                      type="file"
                      className="mt-2"
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.files?.[0]?.name || '' })}
                      required={q.isRequired}
                    />
                  )}
                </div>
              ))}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Survey'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
