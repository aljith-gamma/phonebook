"use client"
import { Box, Button, Container, FormControl, IconButton, Input, InputAdornment, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios, { AxiosError } from "axios";
import { config } from "@/config/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
    const [ data, setData ] = useState({
        name: '',
        email: '',
        password: '',
        rePassword: ''
    })

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const router = useRouter();

    const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const register = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
        if(data.password !== data.rePassword){
            toast.warn('Password not match !', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "light",
            });
        }else {
            try {
                const res = await axios.post(`${config.API_URL}/auth/signup`, { ...data });
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
    }
    return (
        <Container maxWidth="lg">
            <ToastContainer />
            <form style={{ width: "100%", height: "90vh"}}
                onSubmit={register}
            >
                <Box width="100%" height="100%"
                    display="flex" flexDirection="column"
                    justifyContent="center" alignItems="center"
                >
                    <Stack width="50%" spacing={2} p={6} px={10} boxShadow="rgba(0, 0, 0, 0.45) 0px 5px 15px"
                        borderRadius="15px" 
                        >
                        <Typography fontSize="32px" textAlign="center">
                            Register
                        </Typography>

                        <TextField label="Name" variant="standard" name="name" value={data.name} 
                            onChange={handleChange} required={true}
                        />
                        <TextField label="Email" variant="standard" name='email' value={data.email} 
                            onChange={handleChange} required={true}
                        />
                        <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword1 ? 'text' : 'password'}
                                value={data.password}  name='password'
                                onChange={handleChange}  required={true}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword1}
                                    >
                                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Re-enter Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword2 ? 'text' : 'password'}
                                value={data.rePassword}  name='rePassword'
                                onChange={handleChange} required={true}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword2}
                                    >
                                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                            {/* <TextField label="Re-enter Password" variant="standard" type="password" name='rePassword' value={data.rePassword} 
                                onChange={handleChange}
                            /> */}
                        </FormControl>

                        <Typography >Already have an account? <Link href="/login">login</Link></Typography>

                        <Box>
                            <Button sx={{ mt: '10px', width: '100%'}} size="large" variant="contained"
                                type="submit"
                            >Register</Button>
                        </Box>
                    </Stack>
                </Box>
            </form>
        </Container>
    )
}

export default Register;