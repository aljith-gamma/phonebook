"use client"
import PrivateRouter from "@/components/PrivateRouter";
import { config } from "@/config/config";
import { Box, Container, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

interface IContact {
    id: number;
    name: string;
    phone: string;
    address: string;
    isBookmarked: boolean;
    avatar_url: string | null;
    label: string;
}

const GenerateImage = ({ avatar_url, name, id }: IContact) => {
    const url = avatar_url && `${config.API_URL}/web/${avatar_url.split('/').pop()}`;
    if(url){
        return (
            <Box width={200} height={200} borderRadius="50%" overflow="hidden"
                boxShadow="rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
                display="flex" justifyContent="center" alignItems="center"
            >
                <img src={url} alt={name} style={{
                    width: '100%', height: '100%'
                }} />
            </Box>
        )
    }else {
        const colors = [
            {
                c: 'black',
                b: 'white'
            },
            {
                c: 'black',
                b: 'orange'
            },
            {
                c: 'white',
                b: 'green'
            },
            {
                c: 'black',
                b: 'yellow'
            },
            {
                c: 'black',
                b: 'pink'
            }
        ]
        
        const index = id % colors.length;
        return (
            <Box width={200} height={200} borderRadius="50%" overflow="hidden"
                boxShadow="rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
                display="flex" justifyContent="center" alignItems="center"
                color={colors[index].c} bgcolor={colors[index].b}
            >
                <Typography
                    fontWeight="600" fontSize="90px"
                >{ name[0].toUpperCase() }</Typography>
            </Box>
        )
    }
}

const IndividualContactPage = ({ params: { id } }: any) => {
    const [contact, setContact] = useState<IContact | null>(null);

    useEffect(() => {
        fetchData(id);
    }, []);

    const fetchData = async (id: number) => {
        try {
            const token = localStorage.getItem('token') || 'token';
            const res =  await axios.get(`${config.API_URL}/phonebook/getone/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if(res?.data?.status){
                setContact({
                    ...res.data.data
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    const spanStyle = {
        color: '#696c70',
        marginRight: "15px"
    }

    return (
        <PrivateRouter>
            <Container>
                <Box  m={14} >
                    <Typography fontSize="32px" textAlign="center">Contact Details</Typography>
                    <Box bgcolor="#eddedd" p={6} display="grid" gridTemplateColumns="1fr 3fr"
                        gap={6} mt={6}
                    >

                        <Box>
                            <Box display="flex" flexDirection="column" gap={5}
                                justifyContent="center" alignItems="center"
                            >
                                { contact && <GenerateImage { ...contact } /> }
                            </Box>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <Stack spacing={2}>
                                <Typography fontSize="20px"><span style={spanStyle}>Name: </span> { contact && contact.name }</Typography>
                                <Typography fontSize="20px"><span style={spanStyle}>Phone:  </span>{ contact && contact.phone }</Typography>
                                <Typography fontSize="20px"><span style={spanStyle}>Address:  </span>{ contact && contact.address }</Typography>
                                <Typography fontSize="20px"><span style={spanStyle}>Label:  </span>{ contact && contact.label }</Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </PrivateRouter>
    )
}

export default IndividualContactPage;