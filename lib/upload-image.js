import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import axios from "axios";

export const uploadImage = (file) => {
	const formData = new FormData();
	formData.append("file", file);

	return axios.put("/storage/image", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
};

export const useUploadImage = () => {
	const {
		error,
		isPending: loading,
		mutateAsync: uploadImageFn,
	} = useMutation({
		mutationFn: uploadImage,
	});

	return { uploadImage: uploadImageFn, loading, error };
};
