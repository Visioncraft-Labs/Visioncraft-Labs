import { useQuery } from "@tanstack/react-query";
import ImageUpload from "@/components/image-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/scroll-reveal";
import { Clock, CheckCircle, Camera } from "lucide-react";

interface ImageUpload {
  id: number;
  originalName: string;
  status: string;
  createdAt: string;
  clientName?: string;
  clientEmail?: string;
}

const Preview = () => {
  const { data: uploads = [], refetch } = useQuery<ImageUpload[]>({
    queryKey: ["/api/uploads"],
    staleTime: 30000, // 30 seconds
  });

  const handleUploadSuccess = () => {
    refetch();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploaded":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Camera className="h-4 w-4 animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded":
        return "secondary";
      case "processing":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploaded":
        return "Awaiting Review";
      case "processing":
        return "Processing";
      case "completed":
        return "Ready";
      default:
        return status;
    }
  };

  return (
    <div className="pt-16">
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-inter font-bold mb-4">
                Client <span className="gradient-text-primary">Preview</span> Tool
              </h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Upload your product images to see how our professional transformation services can enhance your visuals. 
                Get a preview of what's possible before committing to a full project.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Upload Section */}
            <ScrollReveal>
              <div>
                <ImageUpload onUploadSuccess={handleUploadSuccess} />
                
                <div className="mt-8 card-luxury p-6 rounded-lg">
                  <h3 className="text-lg font-inter font-semibold mb-4 gradient-text-secondary">
                    What Happens Next?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="gradient-bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Upload Review</p>
                        <p className="text-sm text-muted">Our team reviews your image within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="gradient-bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Preview Creation</p>
                        <p className="text-sm text-muted">We create a sample transformation preview</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="gradient-bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Consultation</p>
                        <p className="text-sm text-muted">Discuss your project needs and pricing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Upload History */}
            <ScrollReveal delay={200}>
              <div>
                <h3 className="text-2xl font-inter font-bold mb-6 gradient-text-secondary">
                  Recent Uploads
                </h3>
                
                {uploads.length === 0 ? (
                  <Card className="card-luxury">
                    <CardContent className="p-8 text-center">
                      <Camera className="h-12 w-12 text-muted mx-auto mb-4" />
                      <p className="text-muted">No uploads yet. Upload your first image to get started!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {uploads.map((upload) => (
                      <Card key={upload.id} className="card-luxury">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium truncate">{upload.originalName}</h4>
                              <p className="text-sm text-muted">
                                {new Date(upload.createdAt).toLocaleDateString()} at{" "}
                                {new Date(upload.createdAt).toLocaleTimeString()}
                              </p>
                              {upload.clientName && (
                                <p className="text-sm text-muted">by {upload.clientName}</p>
                              )}
                            </div>
                            <div className="ml-4">
                              <Badge 
                                variant={getStatusColor(upload.status) as any}
                                className="flex items-center space-x-1"
                              >
                                {getStatusIcon(upload.status)}
                                <span>{getStatusText(upload.status)}</span>
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Benefits Section */}
          <ScrollReveal delay={400}>
            <div className="mt-20">
              <h3 className="text-2xl font-inter font-bold text-center mb-12 gradient-text-primary">
                Why Use Our Preview Tool?
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="card-luxury p-6 text-center">
                  <div className="gradient-bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-inter font-semibold mb-2">Risk-Free Preview</h4>
                  <p className="text-muted text-sm">
                    See our capabilities before committing to a full project
                  </p>
                </div>
                
                <div className="card-luxury p-6 text-center">
                  <div className="gradient-bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-inter font-semibold mb-2">Quality Assurance</h4>
                  <p className="text-muted text-sm">
                    Experience our professional standards firsthand
                  </p>
                </div>
                
                <div className="card-luxury p-6 text-center">
                  <div className="gradient-bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-inter font-semibold mb-2">Fast Turnaround</h4>
                  <p className="text-muted text-sm">
                    Get your preview within 24 hours of upload
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Preview;