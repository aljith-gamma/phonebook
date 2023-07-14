import { Box, Button, Input, InputAdornment, Menu, MenuItem, Typography } from "@mui/material"
import Person2Icon from '@mui/icons-material/Person2';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, useRef, useState } from "react";
import DialogBox from "./DialogBox";

interface INavbar {
    handleClickOpen: () => void;
    fetchContacts: (count: number, q?: string, f?: string) => void,
    refresh: () => void
}

const Navbar = ({ handleClickOpen, fetchContacts, refresh }: INavbar) => {
    const [query, setQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filter, setFilter] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const timeoutId = useRef<any>(null);

    const open = Boolean(anchorEl);

    const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        let q = e.target.value;
        setQuery(q);
        timeoutId.current && clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
            debounce(q);
        }, 1000);
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = (e: any) => {
      setAnchorEl(null);
      const val = e.target.innerText;
      if(val === 'All') {
        setFilter('');
        fetchContacts(0);
      }
      else {
        setFilter(val);
        fetchContacts(0, '', val);
      }
    };

    const debounce = (q: string) => {
        fetchContacts(0, q);
    }

    const handleDialogBox = () => {
        setOpenDialog(false);
    }

    const opendDialogBox = () => {
        setOpenDialog(true);
    }

    const logoutUser = () => {
        localStorage.clear();
        setOpenDialog(false);
        refresh();
    }

    return (
        <Box  boxShadow="0px 13px 10px -15px #111" position="fixed" top="0" width="100%" zIndex="10"
            bgcolor="white"
        >
            <DialogBox open={ openDialog } handleClose={handleDialogBox} 
                message="Do you really want to logout?" color="error" btnText="Logout"
                agreeHandler={ logoutUser }
            />
            <Box p="10px 70px" display="flex" 
                justifyContent="space-between"
            >
                <Box display="flex" alignItems="center" gap={2} > 
                    <Box bgcolor="#1972E7" width="45px" height="45px" borderRadius="50%"
                        display="flex" justifyContent="center" alignItems="center"
                    >
                        <Person2Icon sx={{ color: '#fff', fontSize:"30px" }} />
                    </Box>
                    <Box>
                        <Typography fontSize="18px" color="gray" fontWeight="600">
                            Phonebook
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }} >
                        <Input
                            placeholder="Search"
                            sx={{ fontSize: "20px"}}
                            id="input-with-icon-adornment"
                            startAdornment={
                                <InputAdornment position="start">
                                <SearchIcon />
                                </InputAdornment>
                            }
                            onChange={ handleQueryChange }
                        />
                    </Box>
                </Box>

                <Box display="flex" gap={6} alignItems="center">
                    <Box sx={{ cursor: 'pointer'}} display="flex"
                        alignItems="center"
                    >
                        <Button
                            id="demo-positioned-button"
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <FilterAltOutlinedIcon sx={{ fontSize: "30px"}} />
                        </Button>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={handleClose}>All</MenuItem>
                            <MenuItem onClick={handleClose}>FRIENDS</MenuItem>
                            <MenuItem onClick={handleClose}>WORK</MenuItem>
                            <MenuItem onClick={handleClose}>SCHOOL</MenuItem>
                            <MenuItem onClick={handleClose}>FAMILY</MenuItem>
                        </Menu>

                        <Typography width="100px">{ filter }</Typography>
                    </Box>
                    <Box onClick={ handleClickOpen }>
                        <Button variant="text" sx={{ display:"flex", alignItems:"center", border: '1px solid rgba(0, 0, 0, 0.2)' ,
                            color: 'black'
                        }}>
                            <AddIcon sx={{ fontSize: "32px", mt: "-1px", color: '#ee4d25;' }}/>
                            Create contact
                        </Button>
                    </Box>

                    <Button variant="contained" color='error' sx={{ fontWeight: '600'}}
                        onClick={ opendDialogBox }
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Navbar;