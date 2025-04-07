import { Input } from "@/components/ui/input";

type SearchBarProps = {
  onSearch: (term: string) => void;
};

export function SearchBar({ onSearch }: Readonly<SearchBarProps>) {
  return (
    <Input
      type="text"
      placeholder="Search by name or email"
      onChange={(e) => onSearch(e.target.value)}
      className="max-w-sm"
    />
  );
}
