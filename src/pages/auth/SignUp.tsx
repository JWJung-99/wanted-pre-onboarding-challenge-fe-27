import useUserStore from "@store/userStore";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface IFormData {
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    watch,
    getValues,
    setError,
    clearErrors,
    reset,
  } = useForm<IFormData>();
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  // 비밀번호 일치 여부 확인
  useEffect(() => {
    if (
      watch("password") !== watch("passwordConfirm") &&
      watch("passwordConfirm")
    ) {
      setError("passwordConfirm", {
        type: "password-mismatch",
        message: "비밀번호가 일치하지 않습니다.",
      });
    } else {
      clearErrors("passwordConfirm");
    }
  }, [watch("password"), watch("passwordConfirm")]);

  const onSubmit: SubmitHandler<IFormData> = async (formData) => {
    try {
      const response = await fetch("http://localhost:8080/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) throw new Error(data.details);
      } else {
        setUser(data.token);
        alert("회원가입이 완료되었습니다!");
        navigate("/auth/login");
      }
    } catch (e) {
      if (e instanceof Error) alert(e.message);
    } finally {
      reset();
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
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            type="password"
            id="passwordConfirm"
            placeholder="비밀번호를 한 번 더 입력하세요."
            {...register("passwordConfirm", {
              required: "비밀번호를 한 번 더 입력하세요",
              validate: {
                isCorrect: (value) => {
                  if (value !== getValues("password"))
                    return "비밀번호가 일치하지 않습니다.";
                },
              },
            })}
          />
          {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}
        </div>
        <button type="submit" disabled={!isValid}>
          회원가입
        </button>
      </form>
    </section>
  );
};

export default SignUp;
