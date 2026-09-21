'use client';

import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  Download,
  File,
  FileEdit,
  FileImage,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  RotateCcw,
  Scissors,
  Settings,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';

type ToolTab = 'pdf' | 'image' | 'text';

type ToolId =
  | 'merge'
  | 'split'
  | 'compress'
  | 'rotate'
  | 'reorder'
  | 'deletePages'
  | 'extractPages'
  | 'pdfToImage'
  | 'imageToPdf'
  | 'pdfToText'
  | 'textToPdf'
  | 'pdfToDocx'
  | 'docxToPdf'
  | 'pptxToPdf'
  | 'xlsxToPdf'
  | 'watermark'
  | 'metadata';

type ImageToolId =
  | 'imageCompress'
  | 'resize'
  | 'crop'
  | 'jpgToPng'
  | 'pngToJpg'
  | 'webpConvert'
  | 'imageMetadata';

type TextToolId =
  | 'wordCount'
  | 'caseConvert'
  | 'loremIpsum'
  | 'removeDuplicate'
  | 'sortLines'
  | 'jsonFormatter';

interface ToolDefinition {
  id: string;
  label: string;
  icon: typeof FileText;
  description: string;
  inputTypes?: string[];
  outputType?: string;
  backendRequired?: boolean;
}

const pdfTools: ToolDefinition[] = [
  {
    id: 'merge',
    label: 'Merge PDF',
    icon: FileText,
    description: 'Combine multiple PDF files into one document.',
    inputTypes: ['PDF'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'split',
    label: 'Split PDF',
    icon: Scissors,
    description: 'Split a PDF into multiple files by page ranges.',
    inputTypes: ['PDF'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'compress',
    label: 'Compress PDF',
    icon: ArrowDown,
    description: 'Reduce PDF file size while preserving quality.',
    inputTypes: ['PDF'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'rotate',
    label: 'Rotate PDF',
    icon: RotateCcw,
    description: 'Rotate PDF pages by 90°, 180° or 270°.',
    inputTypes: ['PDF'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'reorder',
    label: 'Reorder Pages',
    icon: ArrowUp,
    description: 'Change the order of pages in a PDF.',
    inputTypes: ['PDF'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'deletePages',
    label: 'Delete Pages',
    icon: Trash2,
    description: 'Remove selected pages from a PDF.',
    inputTypes: ['PDF'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'extractPages',
    label: 'Extract Pages',
    icon: Download,
    description: 'Extract selected pages into a new PDF.',
    inputTypes: ['PDF'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'pdfToImage',
    label: 'PDF to Images',
    icon: ImageIcon,
    description: 'Convert PDF pages to PNG or JPG images.',
    inputTypes: ['PDF'],
    outputType: 'Images',
    backendRequired: true,
  },
  {
    id: 'imageToPdf',
    label: 'Images to PDF',
    icon: FileText,
    description: 'Combine images into a single PDF file.',
    inputTypes: ['JPG', 'PNG', 'WebP'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'pdfToText',
    label: 'PDF to Text',
    icon: FileEdit,
    description: 'Extract text content from a PDF.',
    inputTypes: ['PDF'],
    outputType: 'TXT',
    backendRequired: true,
  },
  {
    id: 'textToPdf',
    label: 'Text to PDF',
    icon: FileText,
    description: 'Convert plain text into a formatted PDF.',
    inputTypes: ['TXT'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'pdfToDocx',
    label: 'PDF to DOCX',
    icon: File,
    description: 'Convert PDF documents to Word format.',
    inputTypes: ['PDF'],
    outputType: 'DOCX',
    backendRequired: true,
  },
  {
    id: 'docxToPdf',
    label: 'DOCX to PDF',
    icon: FileText,
    description: 'Convert Word documents to PDF format.',
    inputTypes: ['DOCX'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'pptxToPdf',
    label: 'PPTX to PDF',
    icon: File,
    description: 'Convert PowerPoint presentations to PDF.',
    inputTypes: ['PPTX'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'xlsxToPdf',
    label: 'XLSX to PDF',
    icon: File,
    description: 'Convert Excel spreadsheets to PDF.',
    inputTypes: ['XLSX'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'watermark',
    label: 'Add Watermark',
    icon: Copy,
    description: 'Add a text or image watermark to PDF pages.',
    inputTypes: ['PDF'],
    outputType: 'PDF',
    backendRequired: true,
  },
  {
    id: 'metadata',
    label: 'View Metadata',
    icon: Settings,
    description: 'View PDF document metadata and properties.',
    inputTypes: ['PDF'],
    outputType: 'Information',
    backendRequired: true,
  },
];

const imageTools: ToolDefinition[] = [
  {
    id: 'imageCompress',
    label: 'Compress Image',
    icon: ImageIcon,
    description: 'Reduce image file size in your browser.',
  },
  {
    id: 'resize',
    label: 'Resize Image',
    icon: ImageIcon,
    description: 'Change image dimensions in pixels.',
  },
  {
    id: 'crop',
    label: 'Crop Image',
    icon: Scissors,
    description: 'Create a cropped version of an image.',
  },
  {
    id: 'jpgToPng',
    label: 'JPG to PNG',
    icon: FileImage,
    description: 'Convert JPG images to PNG format.',
  },
  {
    id: 'pngToJpg',
    label: 'PNG to JPG',
    icon: FileImage,
    description: 'Convert PNG images to JPG format.',
  },
  {
    id: 'webpConvert',
    label: 'WebP Conversion',
    icon: FileImage,
    description: 'Convert images to WebP format.',
  },
  {
    id: 'imageMetadata',
    label: 'Image Metadata',
    icon: Settings,
    description: 'Inspect basic image dimensions and file information.',
  },
];

const textTools: ToolDefinition[] = [
  {
    id: 'wordCount',
    label: 'Word & Character Count',
    icon: FileEdit,
    description: 'Count words, characters, sentences and paragraphs.',
  },
  {
    id: 'caseConvert',
    label: 'Case Converter',
    icon: FileEdit,
    description: 'Convert text to upper, lower, title or sentence case.',
  },
  {
    id: 'loremIpsum',
    label: 'Lorem Ipsum Generator',
    icon: FileEdit,
    description: 'Generate placeholder text for layouts and prototypes.',
  },
  {
    id: 'removeDuplicate',
    label: 'Remove Duplicates',
    icon: Trash2,
    description: 'Remove duplicate lines from text.',
  },
  {
    id: 'sortLines',
    label: 'Sort Lines',
    icon: ArrowUp,
    description: 'Sort text lines alphabetically.',
  },
  {
    id: 'jsonFormatter',
    label: 'JSON Formatter',
    icon: File,
    description: 'Format and validate JSON text.',
  },
];

const defaultLorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

function getTextStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter((sentence) => sentence.trim()).length
    : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length
    : 0;

  return {
    words,
    characters,
    charactersWithoutSpaces,
    sentences,
    paragraphs,
  };
}

function titleCase(text: string) {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function sentenceCase(text: string) {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (match) =>
      match.toUpperCase(),
    );
}

export default function FileToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>('pdf');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [caseMode, setCaseMode] = useState<
    'upper' | 'lower' | 'title' | 'sentence'
  >('upper');
  const [loremCount, setLoremCount] = useState(1);

  const [imageQuality, setImageQuality] = useState(0.8);
  const [imageWidth, setImageWidth] = useState(1200);
  const [imageHeight, setImageHeight] = useState(800);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => getTextStats(text), [text]);

  const currentTools =
    activeTab === 'pdf'
      ? pdfTools
      : activeTab === 'image'
        ? imageTools
        : textTools;

  const activeToolDefinition = currentTools.find(
    (tool) => tool.id === activeTool,
  );

  const selectTool = (tool: ToolDefinition) => {
    setActiveTool(tool.id);
    setStatusMessage(null);
    setSelectedFiles([]);

    if (tool.id === 'wordCount') {
      setText('');
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    setSelectedFiles(files);
    setStatusMessage(
      files.length
        ? `${files.length} file${files.length === 1 ? '' : 's'} selected.`
        : null,
    );
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const files = Array.from(event.dataTransfer.files);

    setSelectedFiles(files);
    setStatusMessage(
      files.length
        ? `${files.length} file${files.length === 1 ? '' : 's'} selected.`
        : null,
    );
  };

  const processImage = async () => {
    const sourceFile = selectedFiles[0];

    if (!sourceFile) {
      setStatusMessage('Please select an image first.');
      return;
    }

    if (!sourceFile.type.startsWith('image/')) {
      setStatusMessage('Please select a valid image file.');
      return;
    }

    setProcessing(true);
    setStatusMessage(null);

    try {
      const imageUrl = URL.createObjectURL(sourceFile);
      const image = new Image();

      image.src = imageUrl;

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Unable to read image.'));
      });

      const canvas = document.createElement('canvas');

      let width = image.naturalWidth;
      let height = image.naturalHeight;

      if (activeTool === 'resize') {
        width = Math.max(1, Math.round(imageWidth));
        height = Math.max(1, Math.round(imageHeight));
      }

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas is not supported by this browser.');
      }

      if (activeTool === 'pngToJpg') {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, width, height);
      }

      context.drawImage(image, 0, 0, width, height);

      const outputType =
        activeTool === 'jpgToPng'
          ? 'image/png'
          : activeTool === 'webpConvert'
            ? 'image/webp'
            : 'image/jpeg';

      const quality =
        outputType === 'image/png' ? undefined : imageQuality;

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, outputType, quality),
      );

      URL.revokeObjectURL(imageUrl);

      if (!blob) {
        throw new Error('Image conversion failed.');
      }

      const extension =
        outputType === 'image/png'
          ? 'png'
          : outputType === 'image/webp'
            ? 'webp'
            : 'jpg';

      const baseName = sourceFile.name.replace(
        /\.[^/.]+$/,
        '',
      );

      downloadBlob(
        blob,
        `${baseName}-${activeTool}.${extension}`,
      );

      setStatusMessage(
        `Done. Generated ${formatBytes(blob.size)} ${extension.toUpperCase()} file.`,
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Image processing failed.',
      );
    } finally {
      setProcessing(false);
    }
  };

  const runTextTool = () => {
    if (activeTool === 'wordCount') {
      setStatusMessage(
        `${stats.words} words, ${stats.characters} characters, ${stats.sentences} sentences and ${stats.paragraphs} paragraphs.`,
      );
      return;
    }

    if (activeTool === 'caseConvert') {
      const converted =
        caseMode === 'upper'
          ? text.toUpperCase()
          : caseMode === 'lower'
            ? text.toLowerCase()
            : caseMode === 'title'
              ? titleCase(text)
              : sentenceCase(text);

      setText(converted);
      setStatusMessage('Text converted successfully.');
      return;
    }

    if (activeTool === 'removeDuplicate') {
      const lines = text.split(/\r?\n/);
      const uniqueLines = Array.from(
        new Set(lines.filter((line) => line.trim())),
      );

      setText(uniqueLines.join('\n'));
      setStatusMessage(
        `Removed ${Math.max(0, lines.length - uniqueLines.length)} duplicate/empty lines.`,
      );
      return;
    }

    if (activeTool === 'sortLines') {
      const sorted = text
        .split(/\r?\n/)
        .sort((a, b) =>
          a.localeCompare(b, undefined, {
            sensitivity: 'base',
          }),
        );

      setText(sorted.join('\n'));
      setStatusMessage('Lines sorted successfully.');
      return;
    }

    if (activeTool === 'jsonFormatter') {
      try {
        const parsed = JSON.parse(text);
        setText(JSON.stringify(parsed, null, 2));
        setStatusMessage('Valid JSON formatted successfully.');
      } catch {
        setStatusMessage('Invalid JSON. Please check the syntax.');
      }

      return;
    }

    if (activeTool === 'loremIpsum') {
      const generated = Array.from(
        { length: Math.max(1, Math.min(loremCount, 20)) },
        () => defaultLorem,
      ).join('\n\n');

      setText(generated);
      setStatusMessage(
        `Generated ${loremCount} lorem ipsum paragraph${loremCount === 1 ? '' : 's'}.`,
      );
    }
  };

  const handleToolAction = async () => {
    if (!activeToolDefinition) {
      return;
    }

    if (activeToolDefinition.backendRequired) {
      setStatusMessage(
        `${activeToolDefinition.label} requires the NexaStudy backend. The UI is ready, but actual PDF processing is not enabled yet.`,
      );
      return;
    }

    if (
      activeTab === 'image' &&
      [
        'imageCompress',
        'resize',
        'jpgToPng',
        'pngToJpg',
        'webpConvert',
      ].includes(activeToolDefinition.id)
    ) {
      await processImage();
      return;
    }

    if (
      activeTab === 'image' &&
      activeToolDefinition.id === 'imageMetadata'
    ) {
      const sourceFile = selectedFiles[0];

      if (!sourceFile || !sourceFile.type.startsWith('image/')) {
        setStatusMessage('Please select an image first.');
        return;
      }

      setProcessing(true);

      try {
        const url = URL.createObjectURL(sourceFile);
        const image = new Image();

        image.src = url;

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () =>
            reject(new Error('Unable to read image.'));
        });

        setStatusMessage(
          `${sourceFile.name} · ${image.naturalWidth} × ${image.naturalHeight}px · ${formatBytes(sourceFile.size)} · ${sourceFile.type}`,
        );

        URL.revokeObjectURL(url);
      } catch {
        setStatusMessage('Unable to read image metadata.');
      } finally {
        setProcessing(false);
      }

      return;
    }

    if (activeTab === 'image' && activeToolDefinition.id === 'crop') {
      setStatusMessage(
        'Crop preview is prepared for the next image-editor phase. Basic resize/conversion is already browser-enabled.',
      );
      return;
    }

    if (activeTab === 'text') {
      runTextTool();
      return;
    }

    setStatusMessage('This tool is ready for backend integration.');
  };

  const copyText = async () => {
    if (!text) {
      setStatusMessage('There is no text to copy.');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setStatusMessage('Text copied to clipboard.');
    } catch {
      setStatusMessage('Clipboard access was not available.');
    }
  };

  const clearWorkspace = () => {
    setText('');
    setSelectedFiles([]);
    setStatusMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex min-h-full flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">File Tools</h1>
              <p className="text-sm text-muted-foreground">
                Process documents, images and text from one workspace.
              </p>
            </div>
          </div>
        </div>

        {(selectedFiles.length > 0 || text) && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWorkspace}
            className="gap-2"
          >
            <X size={14} />
            Clear Workspace
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1">
        {(['pdf', 'image', 'text'] as ToolTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setActiveTool(null);
              setStatusMessage(null);
            }}
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors',
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab === 'pdf'
              ? 'PDF Tools'
              : tab === 'image'
                ? 'Image Tools'
                : 'Text Tools'}
          </button>
        ))}
      </div>

      {/* Tool cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentTools.map((tool) => {
          const Icon = tool.icon;
          const selected = activeTool === tool.id;

          return (
            <Card
              key={tool.id}
              className={cn(
                'cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md',
                selected && 'border-primary ring-2 ring-primary/20',
              )}
              onClick={() => selectTool(tool)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
                      selected && 'bg-primary text-primary-foreground',
                    )}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold">
                        {tool.label}
                      </h3>

                      {tool.backendRequired && (
                        <Badge className="shrink-0 text-[9px]">
                          Backend
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {tool.description}
                    </p>

                    {(tool.inputTypes || tool.outputType) && (
                      <div className="mt-3 flex flex-wrap items-center gap-1">
                        {tool.inputTypes?.map((type) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="text-[9px]"
                          >
                            {type}
                          </Badge>
                        ))}

                        {tool.outputType && (
                          <Badge className="bg-primary/10 text-[9px] text-primary">
                            → {tool.outputType}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Workspace */}
      {activeToolDefinition && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">
                  {activeToolDefinition.label}
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  {activeToolDefinition.description}
                </p>
              </div>

              <Badge
                className={cn(
                  activeToolDefinition.backendRequired
                    ? 'bg-orange-500/10 text-orange-600'
                    : 'bg-green-500/10 text-green-600',
                )}
              >
                {activeToolDefinition.backendRequired
                  ? 'Backend required'
                  : 'Browser enabled'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-5">
            {/* PDF workspace */}
            {activeTab === 'pdf' && (
              <>
                <div className="rounded-xl border border-blue-200/70 bg-blue-50/50 p-4 dark:border-blue-800/30 dark:bg-blue-950/20">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 shrink-0 text-blue-500" size={18} />

                    <div>
                      <p className="text-sm font-medium">
                        PDF processing is backend-ready
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        The frontend provides the complete tool selection
                        and upload experience. Actual PDF operations should
                        be connected to the NexaStudy backend using libraries
                        such as pypdf, PyMuPDF and Pillow.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <Upload className="mx-auto mb-3 text-muted-foreground" size={30} />

                  <h3 className="text-sm font-semibold">
                    Upload your PDF files
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Drag and drop files here or choose files from your device.
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={openFilePicker}
                  >
                    <Upload size={14} />
                    Choose Files
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Selected Files
                    </p>

                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        <FileText
                          size={18}
                          className="shrink-0 text-primary"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {file.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                          </p>
                        </div>

                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-green-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Image workspace */}
            {activeTab === 'image' && (
              <>
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <ImageIcon
                    className="mx-auto mb-3 text-muted-foreground"
                    size={30}
                  />

                  <h3 className="text-sm font-semibold">
                    Upload an image
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG and WebP files are supported.
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={openFilePicker}
                  >
                    <Upload size={14} />
                    Choose Image
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {selectedFiles[0] && (
                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileImage size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {selectedFiles[0].name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {formatBytes(selectedFiles[0].size)} ·{' '}
                          {selectedFiles[0].type || 'Unknown type'}
                        </p>
                      </div>

                      <CheckCircle2
                        size={16}
                        className="text-green-500"
                      />
                    </div>
                  </div>
                )}

                {activeTool === 'resize' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium">
                        Width (px)
                      </span>

                      <input
                        type="number"
                        min={1}
                        value={imageWidth}
                        onChange={(event) =>
                          setImageWidth(Number(event.target.value))
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium">
                        Height (px)
                      </span>

                      <input
                        type="number"
                        min={1}
                        value={imageHeight}
                        onChange={(event) =>
                          setImageHeight(Number(event.target.value))
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </label>
                  </div>
                )}

                {activeTool !== null &&
                [
                  'imageCompress',
                  'jpgToPng',
                  'pngToJpg',
                  'webpConvert',
                ].includes(activeTool) && (
                  <label className="block space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Image Quality
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {Math.round(imageQuality * 100)}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={imageQuality}
                      onChange={(event) =>
                        setImageQuality(Number(event.target.value))
                      }
                      className="w-full"
                    />
                  </label>
                )}
              </>
            )}

            {/* Text workspace */}
            {activeTab === 'text' && (
              <>
                {activeTool === 'caseConvert' && (
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'upper',
                        'lower',
                        'title',
                        'sentence',
                      ] as const
                    ).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setCaseMode(mode)}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors',
                          caseMode === mode
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:bg-muted',
                        )}
                      >
                        {mode} case
                      </button>
                    ))}
                  </div>
                )}

                {activeTool === 'loremIpsum' && (
                  <label className="block max-w-xs space-y-2">
                    <span className="text-sm font-medium">
                      Paragraphs
                    </span>

                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={loremCount}
                      onChange={(event) =>
                        setLoremCount(
                          Math.max(
                            1,
                            Math.min(
                              20,
                              Number(event.target.value) || 1,
                            ),
                          ),
                        )
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                )}

                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder={
                    activeTool === 'jsonFormatter'
                      ? '{\n  "name": "NexaStudy"\n}'
                      : 'Paste or type your text here...'
                  }
                  className="min-h-[280px] w-full resize-y rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-lg font-bold">{stats.words}</p>
                    <p className="text-xs text-muted-foreground">Words</p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-lg font-bold">{stats.characters}</p>
                    <p className="text-xs text-muted-foreground">
                      Characters
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-lg font-bold">
                      {stats.charactersWithoutSpaces}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      No Spaces
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-lg font-bold">
                      {stats.sentences}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sentences
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-lg font-bold">
                      {stats.paragraphs}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Paragraphs
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Status */}
            {statusMessage && (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-green-500"
                />

                <p className="text-sm text-muted-foreground">
                  {statusMessage}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {activeToolDefinition.backendRequired
                  ? 'Backend integration required for actual processing.'
                  : 'Processing happens locally in your browser.'}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeTab === 'text' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyText}
                    className="gap-2"
                  >
                    <Copy size={14} />
                    Copy
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={handleToolAction}
                  disabled={processing}
                  className="gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Processing...
                    </>
                  ) : activeToolDefinition.backendRequired ? (
                    <>
                      <Settings size={14} />
                      Check Backend Status
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Run Tool
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty selection state */}
      {!activeToolDefinition && (
        <Card>
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText size={26} />
            </div>

            <h2 className="mt-4 text-base font-semibold">
              Choose a tool to get started
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Select any tool above. Browser-enabled tools can process
              supported files locally, while advanced PDF operations are
              prepared for backend integration.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Security note */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-muted-foreground"
          />

          <div>
            <p className="text-sm font-medium">
              Privacy-first processing
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Browser-enabled image and text tools process data locally
              in this frontend. PDF conversion, extraction and document
              transformations should only be enabled after the NexaStudy
              backend and its file-security controls are configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}