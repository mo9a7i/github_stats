import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

export function RepoFilters({ 
  onSortChange, 
  onVisibilityChange 
}: { 
  onSortChange: (value: string) => void
  onVisibilityChange: (value: string) => void 
}) {
  return (
    <div className="flex gap-4 mb-4">
      <Select
        onValueChange={onSortChange}
        defaultValue="stars"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stars">Stars</SelectItem>
          <SelectItem value="updated">Last Updated</SelectItem>
          <SelectItem value="forks">Forks</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={onVisibilityChange}
        defaultValue="all"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 