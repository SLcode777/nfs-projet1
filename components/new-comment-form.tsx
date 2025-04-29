"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const NewCommentForm = ({ postId }: { postId: number }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    content: "",
    postId: postId,
  });

  const router = useRouter();

  console.log("form data on init : ", formData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setFormData({ ...formData, postId });

    console.log("form data on handleSubmit : ", formData);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, postId }),
    });

    console.log("res body in form : ", JSON.stringify({ ...formData, postId }));

    if (res.ok) {
      console.log("commentaire envoyé !", res.body);
      router.refresh();
      setFormData({ email: "", name: "", content: "", postId: postId });
    } else {
      console.error("Erreur lors de l'envoi du commentaire");
    }
  }

  return (
    <>
      {" "}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 p-4 border border-accent shadow mb-4 rounded-lg"
      >
        <div>Ajouter un commentaire</div>
        <Input
          onChange={handleChange}
          name="email"
          value={formData.email}
          placeholder="your mail"
        />
        <Input
          onChange={handleChange}
          name="name"
          value={formData.name}
          placeholder="your name"
        />
        <Input
          onChange={handleChange}
          name="content"
          value={formData.content}
          placeholder="your beautiful comment"
        />

        <Button type="submit" className="w-full">
          {" "}
          Add new comment
        </Button>
      </form>
    </>
  );
};
