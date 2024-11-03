import useUserStore from "@store/userStore";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

interface IFormData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<IFormData>();
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (token) navigate("/");
  }, []);

  const onSubmit: SubmitHandler<IFormData> = async (formData) => {
    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status) throw new Error(data.details);
      } else {
        setUser(data.token);
        alert(data.message);
        navigate("/");
      }
    } catch (e) {
      if (e instanceof Error) alert(e.message);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            id="email"
            placeholder="이메일을 입력하세요."
            {...register("email", {
              required: "이메일을 입력하세요.",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "이메일 형식이 올바르지 않습니다.",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요."
            {...register("password", {
              required: "비밀번호를 입력하세요",
              minLength: {
                value: 8,
                message: "비밀번호는 8자리 이상이어야 합니다.",
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <button type="submit" disabled={!isValid}>
            로그인
          </button>
          <Link to="/auth/signup">회원가입</Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
