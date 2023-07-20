import {useState} from 'react';
import {ref, uploadBytesResumable, getDownloadURL, uploadBytes} from 'firebase/storage';
import {storage} from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';
import {toast} from 'react-toastify';

const useFirestorage = () => {

    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const uploadAvatar = async (type, file) => {

        return new Promise((resolve, reject) => {
            setIsUploading(true);
            const imageRef =ref(storage, `avatars/${type}/${uuidv4()}`);
            const uploadTask = uploadBytesResumable(imageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    toast.error('Image upload failed');
                    setIsUploading(false);
                    reject(error);
                },
                () => {
                    // Handle successful uploads on complete
                    
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            setIsUploading(false);
                            resolve(downloadURL);
                        });
                }
            )
        });

    }

    const uploadRoomImages = async (images, roomTypeId) => {

        try {
            setIsUploading(true);
            let fileNames = [];
            const promiseImages = images.map(img => {
                const fileName = uuidv4();
                fileNames.push(fileName);
                const imageRef = ref(storage, `rooms/${roomTypeId}/${fileName}`);
                return uploadBytes(imageRef, img.file);
            });

            const snapshots = await Promise.all(promiseImages);

            const promiseSnapshots = snapshots.map(s => getDownloadURL(s.ref));

            let imageUrls = await Promise.all(promiseSnapshots);

            imageUrls = imageUrls.map((url, index) => ({url, fileName: fileNames[index]}));

            setIsUploading(false);
            return imageUrls;

        } catch (err) {
            setIsUploading(false);
            console.log(err);
        }
    }

    const uploadVehicleImages = async (images, vehicleId) => {
        try {
            setIsUploading(true);
            const fileNames = [];
            const imagesPromises = images.map(img => {
                const fileName = uuidv4();
                fileNames.push(fileName);
                const imgRef = ref(storage, `vehicles/${vehicleId}/${fileName}`);
                return uploadBytes(imgRef, img.file);
            })
            const snapshots = await Promise.all(imagesPromises);
            const snapshotsPromises = snapshots.map(snapshot => getDownloadURL(snapshot.ref));
            let imageUrls = await Promise.all(snapshotsPromises);
            imageUrls = imageUrls.map((url, index) => ({url, fileName: fileNames[index]}));
            setIsUploading(false);
            return imageUrls;
        } catch (err) {
            setIsUploading(false);
            console.log(err);
        }
    }

    return {
        isUploading,
        progress,
        uploadAvatar,
        uploadRoomImages,
        uploadVehicleImages
    }

}

export default useFirestorage;