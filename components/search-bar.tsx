import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Buscar..."
}) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-4 w-4" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-[0.6rem] border shadow-sm border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          type="button"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
