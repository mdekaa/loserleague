"use client";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "@/components/upgrade-button";
import { Id } from "../../../convex/_generated/dataModel";
import { XIcon } from "lucide-react";
import { useQuery } from "convex/react";

const defaultErrorState = {
  title: "",
  images: "",
};

function ConvexImage({ imageId }: { imageId: Id<"_storage"> }) {
  const imageUrl = useQuery(api.files.getImageUrl, { imageId });

  return (
    imageUrl && (
      <Image
        alt="image test image"
        className="object-contain"
        src={imageUrl}
        layout="fill"
      />
    )
  );
}

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useAction(api.thumbnails.createThumbnailAction);
  const { toast } = useToast();
  const router = useRouter();
  const [errors, setErrors] = useState(defaultErrorState);
  const [images, setImages] = useState<Id<"_storage">[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]); // State for descriptions

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Create a Loser Poll</h1>

      <p className="text-lg max-w-md mb-8">
        Join us in the quest for the least, where voting for the loser is the
        real winner of our funny and offbeat polls!
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const title = formData.get("title") as string;
          let newErrors = {
            ...defaultErrorState,
          };

          if (!title) {
            newErrors = {
              ...newErrors,
              title: "please fill in this required field",
            };
          }

          if (images.length < 2) {
            newErrors = {
              ...newErrors,
              images: "you must upload at least 2 images",
            };
          }

          setErrors(newErrors);
          const hasErrors = Object.values(newErrors).some(Boolean);

          if (hasErrors) {
            toast({
              title: "Form Errors",
              description: "Please fill fields on the page",
              variant: "destructive",
            });
            return;
          }

          try {
            const thumbnailId = await createThumbnail({
              images,
              title,
              descriptions, // Pass descriptions to action
            });

            router.push(`/polls/${thumbnailId}`);
          } catch (err) {
            toast({
              title: "You ran out of free credits",
              description: (
                <div>
                  You must <UpgradeButton /> in order to create more Polls
                  tests
                </div>
              ),
              variant: "destructive",
            });
          }
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Title of the poll</Label>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder="ex: Which resume of mine will keep me unemployed forever?"
            className={clsx({
              border: errors.title,
              "border-red-500": errors.title,
            })}
            style={{ color: "black" }} // Ensure input text is black
          />
          {errors.title && <div className="text-red-500">{errors.title}</div>}
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {images.map((imageUrl, idx) => {
            return (
              <div key={imageUrl} className="flex flex-col relative">
                <div>Loser Image {idx + 1}</div>
                <Button
                  size={"sm"}
                  variant="destructive"
                  className="absolute top-0 right-0 z-10"
                  onClick={() => {
                    setImages((imgs) => imgs.filter((img) => img !== imageUrl));
                  }}
                >
                  <XIcon className="w-4 h-4 mr-1" />
                </Button>
                <div className="relative aspect-[1280/720]">
                  <ConvexImage imageId={imageUrl} />
                </div>
                <Input
                  id={`description-${idx}`} // Unique ID for each description input
                  type="text"
                  placeholder={`Description for Image ${idx + 1}`}
                  value={descriptions[idx] || ""}
                  onChange={(e) => {
                    const newDescriptions = [...descriptions];
                    newDescriptions[idx] = e.target.value;
                    setDescriptions(newDescriptions);
                  }}
                  style={{ color: "black" }} // Ensure input text is black
                />
              </div>
            );
          })}

          <div className="flex flex-col gap-4 mb-8">
            <Label htmlFor="title">
              {images.length > 0 && "Another"} Loser Images
            </Label>
            <UploadButton
              className={(combinedState) => {
                return cn(buttonVariants());
              }}
              content={(progress) =>
                progress === null || progress === 0
                  ? `Choose File(s)`
                  : "Uploading..."
              }
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              multiple
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImages((imgs) => [
                  ...imgs,
                  ...uploaded.map((file) => {
                    return (file.response as any).storageId as Id<"_storage">;
                  }),
                ]);
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />
            {errors.images && (
              <div className="text-red-500">{errors.images}</div>
            )}
          </div>
        </div>

        <Button>Upload Loser Poll</Button>
      </form>
    </div>
  );
}
