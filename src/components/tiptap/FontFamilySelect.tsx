import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FontFamilySelectProps {
  fontFamily: string;
  handleFontFamilyChange: (value: string) => void;
}

const FontFamilySelect: React.FC<FontFamilySelectProps> = ({
  fontFamily,
  handleFontFamilyChange,
}) => {
  return (
    <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
      <SelectTrigger className="p-1 w-[160px]">
        <SelectValue placeholder="폰트 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Arial">Arial</SelectItem>
        <SelectItem value="Courier New">Courier New</SelectItem>
        <SelectItem value="Georgia">Georgia</SelectItem>
        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
        <SelectItem value="Verdana">Verdana</SelectItem>
      </SelectContent>
    </Select>
  );
};
export default FontFamilySelect;
