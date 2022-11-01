import { Link } from "react-router-dom";
import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

const Navbar = () => {
	return (<AppBar
		position="static"
		color="secondary"
		sx={{ justifyContent: 'space-between' }}
	>
		<Toolbar sx={{ justifyContent: 'flex-end' }}>
			<Typography
				color="primary"
				component={Link}
				to="/"
				sx={{
					flexGrow: 1,
					display: { xs: 'none', sm: 'block' }
				}}
			>
				<LoyaltyIcon
					sx={{
						flexGrow: 1,
						display: { xs: 'none', sm: 'block' }
					}}
				/>
			</Typography>
			<Button color="inherit" component={Link} to="/login">
				Login
			</Button>
			<Button color="inherit" component={Link} to="/signup">
				Sign Up
			</Button>
			{/* {user
				? <div>
					<em>{user.name} logged in </em>
					<Button onClick={handleLogout} color="inherit">Logout</Button>
				</div>
				: <Button color="inherit" component={Link} to="/login">
					login
				</Button>
			} */}
		</Toolbar>
	</AppBar>);
};

export default Navbar;