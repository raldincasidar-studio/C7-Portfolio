import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle, Eye } from "lucide-react";

const STORAGE_KEY = "c7_notice_acknowledged";

export function FirstVisitNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[520px] p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton
      >
        {/* Hidden a11y labels required by Radix Dialog */}
        <DialogTitle className="sr-only">Website Preview Notice</DialogTitle>
        <DialogDescription className="sr-only">
          This website is a preview under development by Raldin Casidar Studio.
        </DialogDescription>

        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="px-6 pt-5 pb-6 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-foreground">
                Website Preview Notice
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Please read before continuing
              </p>
            </div>
          </div>

          {/* Notice body */}
          <div className="bg-zinc-50 rounded-xl p-5 text-sm leading-relaxed text-foreground space-y-3 border border-zinc-100">
            <p>
              This website is <strong>not yet officially launched</strong> and is a preview of a
              project currently under development by{" "}
              <a
                href="https://raldincasidar.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Raldin Casidar Studio
              </a>
              .
            </p>
            <p>
              The content shown here may be outdated and{" "}
              <strong>major updates may be made</strong> before the official launch. This is
              shared for <strong>early preview and portfolio purposes only</strong>.
            </p>
            <p>
              To reach C7 Convenience Store directly, use the social media links at the
              bottom of this page or visit their official stores listed on the{" "}
              <a
                href="/locations"
                className="text-primary font-semibold hover:underline"
                onClick={handleAcknowledge}
              >
                Locations page
              </a>
              .
            </p>
          </div>

          {/* Analytics notice */}
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
            <Eye className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p>
              By continuing, you acknowledge that{" "}
              <strong className="text-blue-700">RC Studio may collect anonymous analytics
              data</strong>{" "}(page visits, interaction patterns) to improve this project.
              No personal information is stored without your explicit consent.
            </p>
          </div>

          {/* CTA */}
          <Button className="w-full font-bold text-base py-5" onClick={handleAcknowledge}>
            Okay, I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
