import SignUpClasses from "./SignUp.module.scss";
import Header from "../MainPage/Header/Header";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../services/blog-services";
import { useForm } from "react-hook-form";

export default function SignUp() {
    const { register, handleSubmit, watch, formState: { errors }, setError } = useForm({
        mode: "all",
        defaultValues: {
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
        }
    });
    const [registerUser] = useRegisterUserMutation();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const { username, email, password } = data;
        const user = {
            user: {
                username,
                email,
                password,
            }
        }

        try {
            await registerUser(user).unwrap()
            navigate("/sign-in");
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
        <div>
            <Header />
            <div className={SignUpClasses.wrapper}>
                <div className={SignUpClasses.signUp}>
                    <h1>Create new account</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label className={SignUpClasses.inputWrapper}>
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
                            <div>{errors.username && <p className={SignUpClasses.error}>{errors.username.message}</p>}</div>
                        </label>
                        <label className={SignUpClasses.inputWrapper}>
                            <p>Email</p>
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
                            <div>{errors.email && <p className={SignUpClasses.error}>{errors.email.message}</p>}</div>
                        </label>
                        <label className={SignUpClasses.inputWrapper}>
                            <p>Pasword</p>
                            <input placeholder="Password"
                                type="password"
                                {...register("password", {
                                    required: "Поле обязательно к заполнению",
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
                            <div>{errors.password && <p className={SignUpClasses.error}>{errors.password.message}</p>}</div>
                        </label>
                        <label className={SignUpClasses.inputWrapper}>
                            <p>Repeat password</p>
                            <input placeholder="Password"
                                type="password"
                                {...register("repeatPassword", {
                                    required: "Поле обязательно к заполнению",
                                    validate: (value) => {
                                        if (value !== watch("password")) {
                                            return "Пароли не совпадают";
                                        }
                                    },
                                })}
                                style={errors.repeatPassword ? { border: "1px solid #F5222D" } : {}}
                            />
                            <div>{errors.repeatPassword && <p className={SignUpClasses.error}>{errors.repeatPassword.message}</p>}</div>
                        </label>
                        <label className={SignUpClasses.checkbox}>
                            <div className={SignUpClasses.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    {...register("checkbox", {
                                        required: "Обязательно к подтверждению",
                                    })}
                                />
                                <p>I agree to the processing of my personal information</p>
                            </div>
                            {errors.checkbox && <p className={SignUpClasses.error}>{errors.checkbox.message}</p>}
                        </label>
                        <button type="submit">Create</button>
                    </form>
                    <p className={SignUpClasses.auth}>Already have an account? <Link to='/sign-in'>Sign In</Link></p>
                </div>
            </div>
        </div>
    )
}