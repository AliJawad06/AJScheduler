import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import {
  TextInput,
  FileInput,
  Button,
} from "@mantine/core"
import { uploadImage } from '~/fn/storage'
import { imgToJSON } from '~/fn/cv'


export type FormValues = {
  name: string
  fisle: File | null
}



export const Route = createFileRoute('/_authed/scheduleForm')({
  component: FormComponent,
})

export default function FormComponent() {

  const { Field, handleSubmit, state } = useForm<FormValues>({
    defaultValues: {
      name: '',
      fisle: null, // ✅ proper default
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("file", value.fisle)
       uploadImage({data: formData})
       .then(async (data) => {
          const imgFormData = new FormData(); 
          imgFormData.append("filePath", data)
          const scheduleJSON = await imgToJSON({data: imgFormData})
          .then(async(data) => { 
            console.log(JSON.stringify(data))
          })

       })
      //TODO add success 
      
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <Field
        name="name"
        children={({ state, handleChange, handleBlur }) => (
          <TextInput
            value={state.value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter your name"
          />
        )}
      />
      <Field
        name="fisle"
        children={({ state, handleChange, handleBlur }) => (
          <FileInput
            placeholder="Pick file"
            label="Your resume"
            withAsterisk
            value={state.value ?? undefined} // ✅ avoids null errors
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
