import SignInClasses from "./SignIn.module.scss";
import Header from "../MainPage/Header/Header";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginUserMutation } from "../services/blog-services";

export default function SignIn() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        mode: "all",
        defaultValues: {
            email: "",
            password: "",
        }
    });
    const navigate = useNavigate();
    const [loginUser] = useLoginUserMutation();

    const onSubmit = async (data) => {
        const { email, password } = data;
        const user = {
            user: {
                email,
                password,
            }
        };

        try {
            const response = await loginUser(user).unwrap();
            sessionStorage.setItem("token", response.user.token);
            navigate("/articles");
        } catch (error) {
            const errors = error.data.errors

            if(errors['email or password']) {
                setError("email", { type: "server", message: "Неверный email или пароль" });
                setError("password", { type: "server", message: "Неверный email или пароль" });
            }
        }
    }

    return (
        <div>
            <Header />
            <div className={SignInClasses.wrapper}>
                <div className={SignInClasses.signIn}>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={SignInClasses.inputWrapper}>
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
                            <div>{errors.email && <p className={SignInClasses.error}>{errors.email.message}</p>}</div>
                        </div>
                        <div className={SignInClasses.inputWrapper}>
                            <p>Password</p>
                            <input placeholder="Password"
                                type="password"
                                {...register("password", {
                                    required: "Поле обязательно к заполнению",
                                })}
                                style={errors.password ? { border: "1px solid #F5222D" } : {}}
                            />
                            <div>{errors.password && <p className={SignInClasses.error}>{errors.password.message}</p>}</div>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <p className={SignInClasses.auth}>Don’t have an account? <Link to='/sign-up'>Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}