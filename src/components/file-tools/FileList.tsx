import { FileListItem } from './FileListItem';

interface FileListProps {
  files: File[];
  onRemove?: (file: File) => void;
  onDownload?: (file: File) => void;
  title?: string;
}

export function FileList({
  files,
  onRemove,
  onDownload,
  title = 'Selected Files',
}: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>

        <span className="text-xs text-muted-foreground">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      <div className="space-y-2">
        {files.map((file, index) => (
          <FileListItem
            key={`${file.name}-${file.lastModified}-${index}`}
            file={file}
            onRemove={onRemove}
            onDownload={onDownload}
          />
        ))}
      </div>
    </section>
  );
}