import { IContact } from "@/app/page";
import { Box, Typography } from "@mui/material";
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChangeEvent, useState } from "react";
import { config } from "@/config/config";
import EditContact from "./EditContact";
import DialogBox from "./DialogBox";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface IGenerateImage {
    avatar: string | null;
    name: string;
    ind: number
}

const GenerateImage = ({ avatar, name, ind}: IGenerateImage) => {
    const url = avatar && `${config.API_URL}/web/${avatar.split('/').pop()}`;
    if(url){
        return (
            <Box width={43} height={43} borderRadius="50%" overflow="hidden"
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
        
        const index = ind % colors.length;
        return (
            <Box width={43} height={43} borderRadius="50%" overflow="hidden"
                boxShadow="rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
                display="flex" justifyContent="center" alignItems="center"
                color={colors[index].c} bgcolor={colors[index].b}
            >
                <Typography
                    fontWeight="700" fontSize="20px"
                >{ name[0].toUpperCase() }</Typography>
            </Box>
        )
    }
}

const IndividualContact = ( props : IContact) => {
    const { name, avatar_url, phone, isBookmarked, index, refresh, bookmarkHandler, id } = props;

    const [ show, setShow ] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const router = useRouter();

    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setShow(false);
    };

    const handleShow = (val: boolean) => {
        setShow(val);
    }

    const changeBookmark = () => {
        bookmarkHandler(id, isBookmarked);
    }

    const dialogBoxHandler = () => {
        setOpenDialog(false);
        handleShow(false);
    }

    const dialogBoxOpen = () => {
        setOpenDialog(true);
    }

    const deleteContact = async () => {
        try {
            const token = localStorage.getItem('token') || 'token';
            const res = await axios.delete(`${config.API_URL}/phonebook/${id}`,{
              headers: {
                "Authorization": `Bearer ${token}`
              }
            })
            console.log(res);
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
                
                refresh();
                dialogBoxHandler();
            }else {
                dialogBoxHandler();
                toast.warning(res.data.message, {
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
            console.log(err);
            if(err?.response?.data?.message === 'Forbidden resource'){
                console.log('Please login again!');
                return;
            }
          }
    }

    return (
        <Box display="grid" gridTemplateColumns="1fr 1fr" alignItems="center"
            borderBottom="1px solid rgba(0, 0, 0, 0.2)" py={1} px={4} 
            sx={{ "&:hover": {
                    backgroundColor: '#cbd0d3'
                },
                transition: '.2s ease-in-out',
            }}
            onMouseOver={() => handleShow(true)}
            onMouseOut={() => handleShow(false)}
            onClick={() => router.push(`/${id}`) }
        >
            <DialogBox open={ openDialog } handleClose={ dialogBoxHandler } 
                message="Do you want to delete this contact?" color="error"
                btnText="Delete" agreeHandler={deleteContact}
            />
            <Box display="flex" alignItems="center" gap={5}>
                <GenerateImage avatar={ avatar_url} name={ name } ind={index} />
                <Typography fontSize="18px">{ name }</Typography>
                { open && <EditContact open={open} handleClose={handleClose} {...props} refresh={refresh} /> }
            </Box>

            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Typography>{ phone }</Typography>
                </Box>
                <Box display="flex"  gap={5}>
                    <Box>
                        { isBookmarked ? 
                            <BookmarkAddedOutlinedIcon sx={{ 
                                    cursor: 'pointer',
                                    "&:hover": {
                                        color: '#4287f5'
                                    }
                                }}
                                onClick={ (e) => {
                                    e.stopPropagation();
                                    changeBookmark();
                                } }
                            /> : 
                            <BookmarkAddOutlinedIcon sx={{ 
                                    cursor: 'pointer',
                                    "&:hover": {
                                        color: '#4287f5'
                                    }
                                }}
                                onClick={ (e) => {
                                    e.stopPropagation();
                                    changeBookmark();
                                } }
                            /> 
                        }
                    </Box>
                    <Box display="flex" gap={2} visibility={show ? 'visible' : 'hidden'}>
                        <EditOutlinedIcon sx={{ 
                                cursor: 'pointer',
                                "&:hover": {
                                    color: '#2ebd2a'
                                }
                            }}
                            onClick={ (e) => {
                                e.stopPropagation();
                                handleClickOpen();
                            } }
                        />
                        <DeleteIcon sx={{ 
                                cursor: 'pointer',
                                "&:hover": {
                                    color: 'red'
                                }
                            }}
                            onClick={ (e) => {
                                e.stopPropagation();
                                dialogBoxOpen();
                            } }
                        /> 
                    </Box> 
                </Box> 
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default IndividualContact;