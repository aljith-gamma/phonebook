import { useRouter } from "next/navigation";


const PrivateRouter = ({ children }: { children: React.ReactNode}) => {
    const router = useRouter();
    const token = localStorage.getItem('token'); 
    if(token) return children;
    router.push('/login');
}

export default PrivateRouter;