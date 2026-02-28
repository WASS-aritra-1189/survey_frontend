import {
  Type,
  AlignLeft,
  Hash,
  AtSign,
  Phone,
  Circle,
  ChevronDown,
  CheckSquare,
  Star,
  Calendar,
  Clock,
  Smile,
  QrCode,
  MapPin,
  Columns,
  ListOrdered,
} from "lucide-react";

export interface QuestionType {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
}

export const questionTypes: QuestionType[] = [
  // Text
  { id: "text-block", name: "Text Block", icon: <Type className="h-4 w-4" />, category: "Text" },
  { id: "single-line", name: "Single Line Text", icon: <Type className="h-4 w-4" />, category: "Text" },
  { id: "multi-line", name: "Multi Line Text", icon: <AlignLeft className="h-4 w-4" />, category: "Text" },
  
  // Numbers
  { id: "number", name: "Number Input", icon: <Hash className="h-4 w-4" />, category: "Number" },
  { id: "number-auto", name: "Number with Auto Code", icon: <ListOrdered className="h-4 w-4" />, category: "Number" },
  { id: "decimal", name: "Decimal Input", icon: <Hash className="h-4 w-4" />, category: "Number" },
  
  // Contact
  { id: "email", name: "Email", icon: <AtSign className="h-4 w-4" />, category: "Contact" },
  { id: "phone", name: "Phone Number", icon: <Phone className="h-4 w-4" />, category: "Contact" },
  
  // Choice
  { id: "radio", name: "Radio Button", icon: <Circle className="h-4 w-4" />, category: "Choice" },
  { id: "radio-other", name: "Radio with Other", icon: <Circle className="h-4 w-4" />, category: "Choice" },
  { id: "dropdown", name: "Dropdown", icon: <ChevronDown className="h-4 w-4" />, category: "Choice" },
  { id: "dropdown-other", name: "Dropdown with Other", icon: <ChevronDown className="h-4 w-4" />, category: "Choice" },
  { id: "checkbox", name: "Checkbox List", icon: <CheckSquare className="h-4 w-4" />, category: "Choice" },
  { id: "checkbox-other", name: "Checkbox with Other", icon: <CheckSquare className="h-4 w-4" />, category: "Choice" },
  { id: "checkbox-2col", name: "2 Column Checkbox", icon: <Columns className="h-4 w-4" />, category: "Choice" },
  
  // Rating
  { id: "number-point", name: "Number Point", icon: <Hash className="h-4 w-4" />, category: "Rating" },
  { id: "rating", name: "Rating", icon: <Star className="h-4 w-4" />, category: "Rating" },
  { id: "nps", name: "Net Promoter Score", icon: <Smile className="h-4 w-4" />, category: "Rating" },
  
  // Date & Time
  { id: "date", name: "Date", icon: <Calendar className="h-4 w-4" />, category: "Date/Time" },
  { id: "time", name: "Time", icon: <Clock className="h-4 w-4" />, category: "Date/Time" },
  { id: "datetime", name: "Date & Time", icon: <Calendar className="h-4 w-4" />, category: "Date/Time" },
  
  // Special
  { id: "barcode", name: "Barcode Scanner", icon: <QrCode className="h-4 w-4" />, category: "Special" },
  { id: "gps", name: "Map Coordinates (GPS)", icon: <MapPin className="h-4 w-4" />, category: "Special" },
];

export const questionCategories = [
  "Text",
  "Number",
  "Contact",
  "Choice",
  "Rating",
  "Date/Time",
  "Special",
];
