
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative flex-1 ">
    
    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
        search
      </span>
      <input
        type="text"
        placeholder="Buscar raza"
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
