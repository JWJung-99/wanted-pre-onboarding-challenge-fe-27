import useUserStore from "@store/userStore";
import { Link } from "react-router-dom";

const Header = () => {
  const user = useUserStore((state) => state.token);
  const resetUser = useUserStore((state) => state.resetUser);

  const handleLogout = () => {
    resetUser();
  };

  return (
    <header>
      {user ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <div>
          <Link to="/auth/login">로그인</Link>
          <Link to="/auth/signup">회원가입</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
