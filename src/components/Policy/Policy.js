import {
  Backdrop,
  Box,
  Button,
  Container,
  DialogContent,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CustomModel from "../CustomModel/CustomModel";

const Policy = () => {
  const [openPolicy, setOpenPolicy] = useState(false);
  const handleOpenPolicy = () => setOpenPolicy(true);
  const handleClosePolicy = () => setOpenPolicy(false);
  return (
    <>
      <CustomModel
        open={openPolicy}
        handleClose={handleClosePolicy}
        handleOpen={handleOpenPolicy}
        title="Policy"
      >
        <Typography variant="h4">Privacy Policy</Typography>
        <Typography variant="body1">
          Last Updated: September 29, 2023
        </Typography>
        <DialogContent
          sx={{
            overflowY: "auto",
            maxHeight: "60vh", // Adjust the maxHeight as needed
          }}
        >
          <Container>
            <Divider />

            <Typography variant="body1">
              Welcome to SchoolEp Web App! Please read these Terms of Service
              carefully before using our platform. By accessing or using our
              services, you agree to comply with and be bound by the following
              terms and conditions:
            </Typography>

            <Typography variant="h6" gutterBottom>
              1. Acceptance of Terms
            </Typography>

            <Typography variant="body1">
              By using SchoolEp Web App (hereinafter referred to as "the
              Service"), you agree to these Terms of Service and all applicable
              laws and regulations. If you do not agree with these terms, please
              do not use the Service.
            </Typography>

            <Typography variant="h6" gutterBottom>
              2. Description of Service
            </Typography>

            <Typography variant="body1">
              The SchoolEp Web App is an educational platform that provides the
              following features:
            </Typography>

            <List>
              <ListItem>
                <ListItemText primary="ChatGPT Chat API Utilization: Users can interact with a chatbot powered by the ChatGPT API for educational purposes." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Real-time Chatting: Users can engage in real-time chat conversations with other users for collaborative learning and communication." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Creating Notes: Users can create and manage digital notes for educational purposes." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Firebase Authentication: We utilize Firebase for user authentication, including login, signup, and password reset functionalities." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Stripe Payment Gateway: Users have the option to purchase different plans to access premium features, including the use of ChatGPT, with a secure payment gateway provided by Stripe." />
              </ListItem>
              <ListItem>
                <ListItemText primary="User Interaction: Users can create and share their moods and thoughts with other users, fostering a sense of community and collaboration." />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom>
              3. User Accounts
            </Typography>

            <Typography variant="body1">
              You must create a user account to access certain features of the
              Service. When creating an account, you agree to provide accurate
              and up-to-date information. You are responsible for maintaining
              the confidentiality of your account information and are liable for
              all activities that occur under your account.
            </Typography>
          </Container>
        </DialogContent>
      </CustomModel>
    </>
  );
};

export default Policy;
