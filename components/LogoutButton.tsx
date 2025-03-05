import { logout } from "@/store/UserSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"

export default function Logoutbutton(){
  const router = useRouter();
  const dispatch = useDispatch();

  const handlelogout=( )=>{
    dispatch(logout())
    localStorage.removeItem('jwt_token')
  }

  return (
    <div>
        <button onClick={handlelogout}>logout</button>
    </div>
  )
}