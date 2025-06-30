import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ImageUploadProps {
  onUploadSuccess?: (uploadId: number) => void;
  showClientInfo?: boolean;
}

interface UploadResponse {
  success: boolean;
  upload?: {
    id: number;
    originalName: string;
    status: string;
    uploadedAt: string;
  };
  message?: string;
}

const ImageUpload = ({ onUploadSuccess, showClientInfo = true }: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }
      
      return response.json() as Promise<UploadResponse>;
    },
    onSuccess: (data) => {
      if (data.success && data.upload) {
        toast({
          title: "Image uploaded successfully!",
          description: `${data.upload.originalName} has been uploaded for preview.`,
        });
        
        // Reset form
        setSelectedFile(null);
        setPreview(null);
        setClientName("");
        setClientEmail("");
        
        if (onUploadSuccess) {
          onUploadSuccess(data.upload.id);
        }
        
        // Invalidate uploads cache
        queryClient.invalidateQueries({ queryKey: ["/api/uploads"] });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a valid image file (JPEG, PNG, GIF, or WebP).",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    
    if (showClientInfo) {
      formData.append('clientName', clientName);
      formData.append('clientEmail', clientEmail);
      formData.append('clientPhone', clientPhone);
    }

    uploadMutation.mutate(formData);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="card-luxury">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-inter font-bold mb-2 gradient-text-primary">
              Upload Your Product Image
            </h3>
            <p className="text-muted">
              Share your product image to see how we can transform it
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
              dragOver
                ? "border-accent-cyan bg-accent-cyan/10"
                : "border-gray-600 hover:border-accent-cyan/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                />
                <div className="flex items-center justify-center space-x-2">
                  <Check className="h-5 w-5 text-accent-cyan" />
                  <span className="text-sm text-muted">{selectedFile?.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIcon className="h-12 w-12 text-muted mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drop your image here</p>
                  <p className="text-sm text-muted">or click to browse files</p>
                </div>
                <p className="text-xs text-muted">
                  Supports: JPEG, PNG, GIF, WebP (max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Client Information */}
          {showClientInfo && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name (Optional)
                </label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email (Optional)
                </label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Phone Number (Optional)
                </label>
                <Input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="w-full btn-luxury"
          >
            {uploadMutation.isPending ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload for Preview
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;