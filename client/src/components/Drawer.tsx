import * as React from 'react';
//prettier-ignore
import {
	Box,
	Drawer,
	Toolbar,
	List,
	Divider,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText
} from '@mui/material';

import Navbar from './Navbar';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import BlockIcon from '@mui/icons-material/Block';
import { styled } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { AlertContext } from './AlertProvider';
import { logoutUser } from '../services/logout';
import { socket } from '../services/socket';
import { useStateValue } from '../state';

export const StyledLink = styled(Link)`
	color: rgba(0, 0, 0, 0.87);
	text-decoration: none;
`;

const drawerWidth = 200;

const ClippedDrawer = () => {
	const [{ loggedUser }] = useStateValue();
	const [, dispatch] = useStateValue();
	const navigate = useNavigate();
	const alert = React.useContext(AlertContext);

	const handleLogout = async (event: any) => {
		event.preventDefault();
		logoutUser(dispatch);
		if (socket.connected) {
			socket.disconnect();
		}
		alert.success('Logged out');
		navigate('/');
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<Navbar />
			{loggedUser && (
				<Drawer
					variant="permanent"
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						[`& .MuiDrawer-paper`]: {
							width: drawerWidth,
							boxSizing: 'border-box'
						}
					}}
				>
					<Toolbar />
					<Box sx={{ overflow: 'auto' }}>
						<List>
							<ListItem disablePadding component={StyledLink} to="/">
								<ListItemButton>
									<ListItemIcon>
										<PersonSearchOutlinedIcon />
									</ListItemIcon>
									<ListItemText primary="Search" />
								</ListItemButton>
							</ListItem>
							<ListItem
								disablePadding
								component={StyledLink}
								to="/visit_history"
							>
								<ListItemButton>
									<ListItemIcon>
										<HistoryIcon />
									</ListItemIcon>
									<ListItemText primary="Visit History" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding component={StyledLink} to="/likes">
								<ListItemButton>
									<ListItemIcon>
										<FavoriteBorderIcon />
									</ListItemIcon>
									<ListItemText primary="Likes" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding component={StyledLink} to="/matches">
								<ListItemButton>
									<ListItemIcon>
										<JoinInnerIcon />
									</ListItemIcon>
									<ListItemText primary="Matches" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding component={StyledLink} to="/blocks">
								<ListItemButton>
									<ListItemIcon>
										<BlockIcon />
									</ListItemIcon>
									<ListItemText primary="Blocks" />
								</ListItemButton>
							</ListItem>
						</List>
						<Divider />
						<List>
							<ListItem disablePadding component={StyledLink} to="/profile">
								<ListItemButton>
									<ListItemIcon>
										<AccountCircleOutlinedIcon />
									</ListItemIcon>
									<ListItemText primary="Profile" />
								</ListItemButton>
							</ListItem>
							<ListItem onClick={handleLogout} disablePadding>
								<ListItemButton>
									<ListItemIcon>
										<LogoutOutlinedIcon />
									</ListItemIcon>
									<ListItemText primary="Logout" />
								</ListItemButton>
							</ListItem>
						</List>
					</Box>
				</Drawer>
			)}
		</Box>
	);
};

export default ClippedDrawer;
