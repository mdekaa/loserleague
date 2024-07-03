"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { Comments } from "./comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DotIcon,
  GalleryHorizontal,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getVotesFor(thumbnail: Doc<"thumbnails">, imageId: string) {
  if (!thumbnail) return 0;
  const idx = thumbnail.images.findIndex((image) => image === imageId);
  return thumbnail.votes[idx];
}

function getVotePercent(thumbnail: Doc<"thumbnails">, imageId: string) {
  if (!thumbnail) return 0;
  const totalVotes = thumbnail.votes.reduce((acc, val) => acc + val, 0);
  if (totalVotes === 0) return 0;
  return Math.round((getVotesFor(thumbnail, imageId) / totalVotes) * 100);
}

function ThumbnailTestImage({
  imageUrl,
  imageId,
  thumbnail,
  description,
  hasImage,
  hasVoted,
}: {
  imageUrl?: string | null | undefined; // Make imageUrl optional
  imageId: Id<"_storage">;
  thumbnail: Doc<"thumbnails">;
  description: string;
  hasImage: boolean;
  hasVoted: boolean;
}) {
  const voteOnThumbnail = useMutation(api.thumbnails.voteOnThumbnail);

  return (
    <div className="flex flex-col gap-4 border p-4 bg-white dark:bg-gray-950">
      {hasImage && imageUrl ? ( // Check if imageUrl is defined before rendering Image component
        <div className="relative aspect-[1280/720]">
          <Image
            alt="image test"
            className="object-cover"
            src={imageUrl}
            layout="fill"
          />
        </div>
      ) : (
        <div className="bg-gray-200 flex items-center justify-center h-48">
          No image
        </div>
      )}

      <div className="flex gap-4">
        <Link href={`/profile/${thumbnail.userId}`}>
          <Avatar>
            <AvatarImage src={thumbnail?.profileImage} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col dark:text-gray-300 text-gray-700">
          <div className="font-bold mb-2 text-gray-900 dark:text-white">
            {thumbnail.title}
          </div>
          <div className="flex gap-2 items-center text-gray-700 dark:text-gray-300">
            {description} <CheckCircleIcon size={12} />
          </div>
          <div className="flex text-gray-700 dark:text-gray-300">
            <div>1M Views</div>
            <DotIcon />
            {formatDistance(new Date(thumbnail._creationTime), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>

      {hasVoted ? (
        <>
          <Progress
            value={getVotePercent(thumbnail, imageId)}
            className="w-full bg-gray-200"
          />
          <div className="text-lg">{getVotesFor(thumbnail, imageId)} votes</div>
        </>
      ) : (
        <Button
          onClick={() => {
            voteOnThumbnail({
              thumbnailId: thumbnail._id,
              imageId: imageId,
            });
          }}
          size="lg"
          className="w-fit self-center"
        >
          Vote
        </Button>
      )}
    </div>
  );
}

export default function ThumbnailPage() {
  const params = useParams<{ thumbnailId: Id<"thumbnails"> }>();
  const thumbnailId = params.thumbnailId;
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId,
  });
  const user = useQuery(api.users.getMyUser);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const session = useSession();

  const profile = useQuery(
    api.users.getProfile,
    thumbnail
      ? {
          userId: thumbnail.userId,
        }
      : "skip"
  );

  if (!thumbnail || !session.session) {
    return <div>Loading...</div>;
  }

  const hasVoted = Boolean(
    user &&
      (user._id === thumbnail.userId
        ? true
        : thumbnail.voteIds.includes(user._id))
  );

  const sortedImages = thumbnail.images
    .map((image) => image)
    .sort((a, b) => {
      const aVotes = getVotesFor(thumbnail, a);
      const bVotes = getVotesFor(thumbnail, b);
      return bVotes - aVotes;
    });

  return (
    <div className="gap-12 flex flex-col">
      <div className="flex items-center justify-center gap-2">
        Uploaded by
        <Link
          href={`/profile/${thumbnail.userId}`}
          className="dark:text-gray-300 dark:hover:text-gray-100 hover:text-gray-700 text-gray-900 flex items-center justify-center gap-2"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={thumbnail?.profileImage} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{profile?.name}</h1>
        </Link>
      </div>

      <>
        <Tabs defaultValue="grid" className="">
          <TabsList className="grid max-w-96 grid-cols-2 mx-auto mb-4">
            <TabsTrigger
              value="grid"
              className="flex items-center justify-center gap-2"
            >
              <LayoutGrid /> Grid
            </TabsTrigger>
            <TabsTrigger
              className="flex items-center justify-center gap-2"
              value="gallery"
            >
              <GalleryHorizontal /> Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {thumbnail.urls.map((imageUrl, idx) => (
                <ThumbnailTestImage
                  key={imageUrl || `no-image-${idx}`} // Use a key that handles no image scenarios
                  imageId={thumbnail.images[idx]}
                  hasVoted={hasVoted}
                  imageUrl={imageUrl}
                  description={thumbnail.descriptions[idx] || "No description"} // Provide a default if description is undefined
                  hasImage={!!imageUrl} // Check if imageUrl is present
                  thumbnail={thumbnail}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
              <ThumbnailTestImage
                imageId={thumbnail.images[currentImageIndex]!}
                hasVoted={hasVoted}
                imageUrl={thumbnail.urls[currentImageIndex]!}
                description={thumbnail.descriptions[currentImageIndex] || "No description"} // Provide a default if description is undefined
                hasImage={!!thumbnail.urls[currentImageIndex]} // Check if imageUrl is present
                thumbnail={thumbnail}
              />

              <div className="flex justify-between gap-4 items-center">
                <Button
                  onClick={() => {
                    const nextIndex = currentImageIndex - 1;
                    if (nextIndex >= 0) {
                      setCurrentImageIndex(nextIndex);
                    } else {
                      setCurrentImageIndex(thumbnail.images.length - 1);
                    }
                  }}
                  className="w-fit self-center flex gap-2"
                >
                  <ArrowLeftIcon size={"14"} /> Previous
                </Button>

                <div>
                  {currentImageIndex + 1} of {thumbnail.images.length}
                </div>

                <Button
                  onClick={() => {
                    const nextIndex = currentImageIndex + 1;
                    if (nextIndex < thumbnail.images.length) {
                      setCurrentImageIndex(nextIndex);
                    } else {
                      setCurrentImageIndex(0);
                    }
                  }}
                  className="w-fit self-center flex gap-2"
                >
                  Next <ArrowRightIcon size={"14"} />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>

      <Comments thumbnail={thumbnail} />
    </div>
  );
}
