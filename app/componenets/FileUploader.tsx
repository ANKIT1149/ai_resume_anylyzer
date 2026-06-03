import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import formatSize from "~/utils/formatSize";

interface FileUploaderProps {
    onFileSelect: (file: File) => void
}

const FileUploader = ({onFileSelect}: FileUploaderProps) => {
    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setIsDeleted(false)
        onFileSelect?.(file)
    }, [])

    const maxSize = 20 * 1024 * 1024;

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: true,
        accept: {'application/pdf': ['.pdf']},
        maxSize: maxSize
    })

    const file = isDeleted ? null : acceptedFiles[0] || null;

    const handleDeleteFile = (e) => {
        e.preventDefault()
        setIsDeleted(true)
        onFileSelect?.(null)
    }

    return (
        <div className="gradient-border w-full">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="" className="size-10"/>
                            <div className="flex items-center space-x-2">
                                <div>
                                    <p className="text-lg text-gray-700 truncate font-bold">{file.name}</p>
                                    <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer" onClick={handleDeleteFile}>
                                <img src="/icons/cross.svg" alt="" className="w-4 h-4"/>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto w-16 h-16 flex justify-center items-center mb-2">
                                <img src="/icons/info.svg" alt="" className="size-20"/>
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">Click Here To Upload File</span> or Drag and Drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max-size {formatSize(maxSize)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader;