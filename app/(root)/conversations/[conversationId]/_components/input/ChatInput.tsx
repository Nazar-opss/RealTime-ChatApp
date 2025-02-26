"use client";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { useMutationState } from "@/hooks/useMutationState";
import { Button } from "@/components/ui/button";
import { SendHorizontal, SmilePlus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

const chatMessageSchema = z.object({
  content: z.string().min(1, {
    message: "This field can't be empty",
  }),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatInput = (props: Props) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { conversationId } = useConversation();

  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      conversationId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
        textareaRef.current?.focus();
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError ? error.data : "Unexpected error occured"
        );
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    const emoji = emojiObject.emoji;
    const textarea = textareaRef.current;

    console.log(textarea);

    console.log(emoji);

    // if (!textarea) return;

    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const text = form.getValues("content");
    console.log(text);

    const newText = text.slice(0, start) + emoji + text.slice(end);

    form.setValue("content", newText);
    form.trigger("content");

    // setTimeout(() => {
    //   textarea?.focus();
    //   textarea?.setSelectionRange(start + emoji.length, start + emoji.length);
    // }, 0);
  };

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="h-full w-full">
                    <FormControl>
                      <TextareaAutosize
                        onKeyDown={async (e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            await form.handleSubmit(handleSubmit)();
                          }
                        }}
                        rows={1}
                        maxRows={3}
                        {...field}
                        ref={(element) => {
                          field.ref(element);
                          textareaRef.current = element;
                        }}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                        placeholder="Type a message"
                        className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {showEmojiPicker && (
              <div className="absolute right-20 bottom-20">
                <EmojiPicker
                  searchDisabled={true}
                  previewConfig={{ showPreview: false }}
                  onEmojiClick={handleEmojiClick}
                ></EmojiPicker>
              </div>
            )}
            <Button
              disabled={pending}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              size="icon"
            >
              <SmilePlus />
            </Button>
            <Button disabled={pending} type="submit" size="icon">
              <SendHorizontal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
