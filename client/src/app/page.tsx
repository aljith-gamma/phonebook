"use client"
import CreateContact from '@/components/CreateContact'
import IndividualContact from '@/components/IndividualContact';
import Navbar from '@/components/Navbar'
import PrivateRouter from '@/components/PrivateRouter';
import { config } from '@/config/config';
import { Box, Container, Pagination, Stack, Typography } from '@mui/material'
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export interface IContact {
  id: number;
  name: string;
  avatar_url: string;
  phone: string;
  address: string;
  label: string;
  isBookmarked: boolean;
  index: number;
  refresh: () => void;
  bookmarkHandler: (id: number, isBookmark: boolean) => void;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchContacts(page);
  }, [load])

  const fetchContacts = async (count: number = 0, q?: string, filter?: string) => {
    count = count ? count-1 : 0;
    try {
      const token = localStorage.getItem('token') || 'token';
      let queryString = q ? `skip=${count * 10}&q=${q}` : `skip=${count * 10}`;
      queryString = filter ? `${queryString}&filterBy=${filter}` : queryString;

      const res = await axios.get(`${config.API_URL}/phonebook?${queryString}`, {
        headers: {
          "Authorization": token
        }
      })
      if(res?.data?.status){
        // console.log(res.data.data);
        setContacts(res.data.data);
        const count = Math.floor(((res.data.count-1)/10)) + 1;
        setTotalPage(count);
        setTotalCount(res.data.count);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const bookmarkHandler = async (id: number, isBookmark: boolean) => {
    try {
      const token = localStorage.getItem('token') || 'token';
      const res = await axios.patch(`${config.API_URL}/phonebook/bookmark/${id}`,{
        isBookmarked: isBookmark
      },{
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
          setTimeout(() => {
              handleClose();
          }, 2000);
      }
    } catch (err: any) {
      console.log(err);
      if(err?.response?.data?.message === 'Forbidden resource'){
          console.log('Please login again!');
          return;
      }
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const refresh = () => {
    setLoad((val) => !val);
  }



  const pageChangeHandler = (curPage: number) => {
    fetchContacts(curPage);
    setPage(curPage);
  }

  return (
    <PrivateRouter>
      <Box>
        <Navbar handleClickOpen={handleClickOpen} fetchContacts={fetchContacts} refresh={refresh} />
        <CreateContact handleClose={handleClose} refresh={ refresh } open={open} />
        <ToastContainer />
        <Container maxWidth="lg" sx={{ my: "90px"}}>
            <Box display="grid" gridTemplateColumns="1fr 1fr">
              <Typography color="#545252">Name</Typography>
              <Typography color="#545252">Phone Number</Typography>
            </Box>

            <Typography mt={3} color="gray">Contacts({ totalCount })</Typography>

            <Box sx={{ mt: "10px"}}>
              <Stack spacing={2}>
                { !contacts.length ? <h1>No contacts</h1> : (
                  contacts.map((contact, i) => {
                    return <IndividualContact key={contact.id} { ...contact } index={ i } refresh={refresh} bookmarkHandler={bookmarkHandler} />
                  })
                )}
              </Stack>
            </Box>

            <Box mt={5} display="flex" justifyContent="center">
              {contacts.length ? <Pagination count={ totalPage } page={ page } color="secondary" 
                onChange={(e: ChangeEvent<unknown>, curPage: number) => {
                  pageChangeHandler(curPage);
                }}
              /> : <span></span>}
            </Box>
        </Container>
      </Box>
    </PrivateRouter>
  )
}
