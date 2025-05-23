import EditProfileClasses from './EditProfile.module.scss'
import { useGetUserQuery,useUpdateUserMutation } from "../services/blog-services"
import { useForm } from "react-hook-form"
import HeaderAuth from '../MainPage/HeaderAuth/HeaderAuth.jsx'
import { useEffect } from 'react';

export default function EditProfile() {
    const { data } = useGetUserQuery();
    const [updateUser] = useUpdateUserMutation();
    const { register, handleSubmit, formState: { errors, isDirty }, reset, setError } = useForm({
        mode: "onBlur",
        defaultValues: {
            username: "",
            email: "",
            password: "",
            image: "",
        }
    });

    useEffect(() => {
        if (data?.user && !isDirty) {
            reset({
                username: data.user.username || "",
                email: data.user.email || "",
                password: "",
                image: data.user.image || "",
            })
        }
    }, [data, reset, isDirty]);

    const onSubmit = async (formData) => {
        const { username, email, password, image } = formData;
        
        const user = {
            user: {
                username,
                email,
                password,
                image,
            }
        };

        try {
            await updateUser(user).unwrap();
        } catch (error) {
            if (error?.data?.errors) {
                const errors = error.data.errors;
                if (errors.username) {
                    setError("username", { type: "server", message: "Данный username занят" });
                }
                if (errors.email) {
                    setError("email", { type: "server", message: "Данный email уже зарегистрирован" });
                }
            }
        }
        
    }

    return (
        <>
            <HeaderAuth />
            <div className={EditProfileClasses.wrapper}>
                <div className={EditProfileClasses.editProfile}>
                    <h1>Edit Profile</h1>
                    <form>
                        <label className={EditProfileClasses.inputWrapper}>
                            <p>Username</p>
                            <input
                                placeholder="Username"
                                {...register("username", {
                                    required: "Поле обязательно к заполнению",
                                    minLength: {
                                        value: 3,
                                        message: "Минимальная длина 3 символа",
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: "Максимальная длина 20 символов",
                                    },
                                })}
                                style={errors.username ? { border: "1px solid #F5222D" } : {}}
                            />
                            <div>{errors.username && <p className={EditProfileClasses.error}>{errors.username.message}</p>}</div>
                        </label>
                        <label className={EditProfileClasses.inputWrapper}>
                            <p>Email address</p>
                            <input
                                placeholder="Email"
                                {...register("email", {
                                    required: "Поле обязательно к заполнению",
                                    type: "email",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Некорректный email",
                                    },
                                })}
                                style={errors.email ? { border: "1px solid #F5222D" } : {}}
                            />
                            <div>{errors.email && <p className={EditProfileClasses.error}>{errors.email.message}</p>}</div>
                        </label>
                        <label className={EditProfileClasses.inputWrapper}>
                            <p>New password</p>
                            <input placeholder="New password"
                                type="password"
                                {...register("password", {
                                    minLength: {
                                        value: 6,
                                        message: "Минимальная длина 6 символов",
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: "Максимальная длина 40 символов",
                                    },
                                })}
                                style={errors.password ? { border: "1px solid #F5222D" } : {}}
                            />
                            <div>{errors.password && <p className={EditProfileClasses.error}>{errors.password.message}</p>}</div>
                        </label>
                        <label className={EditProfileClasses.inputWrapper}>
                            <p>Avatar image (url)</p>
                            <input placeholder="Avatar image"
                                {...register("image", {
                                    pattern: {
                                        value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/,
                                        message: "Некорректный URL",
                                    },
                                })}
                                style={errors.image ? { border: "1px solid #F5222D" } : {}}
                            />
                            <div>{errors.image && <p className={EditProfileClasses.error}>{errors.image.message}</p>}</div>
                        </label>
                        <button onClick={handleSubmit(onSubmit)} type="submit">Save</button>
                    </form>
                </div>
            </div>
        </>
    )
}