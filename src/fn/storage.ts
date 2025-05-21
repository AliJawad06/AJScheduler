import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { saveFile, deleteFile } from "~/utils/disk_storage";
import path from "path";
import fs from "fs/promises";
import { FormValues } from "~/routes/_authed/scheduleForm";


export const uploadImage = createServerFn({ method: "POST" })
  .handler(async ({ data: formData }) => {
    const file = formData.get("file") as File 
    if (!(file instanceof File)) throw new Error("[file] not found");
    await saveFile(file.name, file)
    return (file.name)
  });
