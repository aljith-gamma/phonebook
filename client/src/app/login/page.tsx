"use client"
import { Box, Button, Container, FormControl, IconButton, Input, InputAdornment, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { config } from "@/config/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
    const [ data, setData ] = useState({
        email: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const login = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
        try {
            const res = await axios.post(`${config.API_URL}/auth/signin`, { ...data });
            console.log(res?.data);
            if(res?.data?.status){
                toast.success(res.data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "light",
                });
                const token = res.data.token;
                localStorage.setItem('token', token);
                setTimeout(() => {
                    router.push('/');
                }, 2000)
            }else {
                toast.error(res.data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (err: any) {
            console.log(err?.response?.data?.message);
            if(err?.response?.data?.message){
                toast.error(err.response.data.message[0], {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    }
    return (
        <Container maxWidth="lg">
            <ToastContainer />
            <form style={{ width: "100%", height: "90vh"}}
                onSubmit={login}
            >
                <Box width="100%" height="100%"
                    display="flex" flexDirection="column"
                    justifyContent="center" alignItems="center"
                >
                    <Stack width="50%" spacing={2} p={6} px={10} boxShadow="rgba(0, 0, 0, 0.45) 0px 5px 15px"
                        borderRadius="15px" 
                        >
                        <Typography fontSize="32px" textAlign="center">
                            Login
                        </Typography>

                        <TextField label="Email" variant="standard" name='email' value={data.email} 
                            onChange={handleChange} required={true}
                        />
                        <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}  name='password'
                                onChange={handleChange}  required={true}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>

                        <Typography >Don't you have an account? <Link href="/register">register</Link></Typography>

                        <Box>
                            <Button sx={{ mt: '10px', width: '100%'}} size="large" variant="contained"
                                type="submit"
                            >Login</Button>
                        </Box>
                    </Stack>
                </Box>
            </form>
        </Container>
    )
}

export default Login;