import React from "react";
import { Layout, Menu, Button, Typography, Row, Col, Card } from 'antd'; 
import {useNavigate } from 'react-router-dom';
import mainimage1 from "../../../src/assets/main page 1.jpg"
import image1 from "../../assets/image 1.jpg"
import image2 from "../../../src/assets/image 2.jpg"
import image3 from "../../../src/assets/image 3.jpg"
import logo1 from "../../../src/assets/image.svg"
import logo2 from "../../../src/assets/image 4.svg"
import logo3 from "../../../src/assets/image 6.svg"
//import { useAuth } from "../SSO/Login/authContext";

const { Header, Content, Footer } = Layout; 
const { Title, Text } = Typography

const Home: React.FC = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const Id = path.split("/").pop();
  /*
  //user-infor
  const { user } = useAuth();
  console.log(user?.email)
  */

  return (
    <Layout style={{backgroundColor:'white'}}> 
      <Header style={{backgroundColor: 'white'}}> 
        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%'}}>
          <div className="logo"></div> 
          <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{display: 'flex', justifyContent: 'flex-end', paddingRight: '10px'}}> 
            <Menu.Item key="1">HOME</Menu.Item> 
            <Menu.Item key="2">ABOUT</Menu.Item> 
            <Menu.Item key="3">CONTACT</Menu.Item> 
          </Menu> 
          {(Id !== "guest" && Id !== "hotel") && (
          <Button style={{ marginLeft: '10px', backgroundColor:'#3AAFA9'}}
            onClick={() => navigate('./sso/login')}>
              Login
          </Button>
          )}
          </div>
      </Header>
      <Content> 
        <div className="banner" style={{backgroundImage: `url(${mainimage1})`, backgroundPosition: 'center', objectFit: 'cover', height: '420px', display: 'flex', justifyContent: 'center', alignItems: 'left'}}> 
          {/*<img src={image1} alt="Tropical Resort" style={{ width: '100%', height: '500px', objectFit: 'cover' }} /> */}
          <div className="banner-text" style={{position: 'relative'}}> 
            <Title level={2} style={{ color: 'black', paddingTop: '50px'}}>
              ENJOY YOUR DREAM VACATION
            </Title> 
            <Text style={{ color: 'black', fontSize: '12px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text> </div> </div> 
            <Row gutter={16} style={{ padding:'30px' }}> 
              <Col span={12}>
                <div> 
                <Title level={2}>About us</Title> 
                </div>
                <Text> Welcome to [Your Website Name], your trusted destination for [briefly describe your niche or industry]. Our mission is to provide high-quality [products, services, or content] that cater to the needs of [target audience]. We are passionate about [your core values or unique selling proposition], and we strive to offer [benefits to users]. 
                </Text>
              </Col> 
              <Col span={12}> 
                <Card cover={<img alt="Welcome" src={image2} style={{ marginTop: '50px' }}/>}>
                  <Card.Meta title="Welcome to our Hotel" />
                </Card>
              </Col>
            </Row>
            <Row gutter={16}  style={{margin: '20px'}}> 
              <Col span={12}> 
                <Card cover={<img alt="Formal Attire" src={image3} />}>
                  <Card.Meta title="Professional Service" />
                </Card>
              </Col>
              <Col span={12} >
                <Text> Founded in [Year], [Your Website Name] began with a simple goal: [share the story behind your website or brand's creation]. Since then, we have grown into a [community/brand/company] that [highlight any achievements or unique features]. 
                </Text>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12} style={{marginTop: '40px', paddingLeft:'40px'}}>
                <Text> At [Your Website Name], we believe in [core philosophy or mission statement]. Whether you're looking for [what your audience seeks], or just [any other offering], we are here to support you every step of the way. 
                </Text>
              </Col>
              <Col span={12}> 
                <Card cover={<img alt="Resort at Night" src={image1} style={{paddingTop: '50px'}}/>}>
                  <Card.Meta title="Beautiful Night View" />
                </Card>
              </Col>
            </Row>
      </Content>
          <Footer style={{backgroundColor:'#3AAFA9', paddingBottom: '50px', paddingTop:'50px'}}> 
            <Row className="footer-content">
              <Col span={10}>
                <Title level={3}>Contact</Title> 
                <Text>We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out. Here's how you can get in touch with us:
                </Text>
              </Col>
              <Col span={8} style={{padding: '20px' ,textAlign: 'center'}}>
                <div> 
                <Text  style={{color:'white'}}>Email: hotel.sso.@gmail.com</Text> </div> 
                <div> <Text  style={{color:'white'}}>Phone: 8888888888</Text> </div> 
                <div> <Text  style={{color:'white'}}>Address: ldjasldjasdjaslkjdkla, dijsaljkdlaksjdkjasjdaslk</Text> 
                </div>
              </Col>
              <Col span={6} style={{textAlign: 'center'}}>
                <Title level={5} style={{color:'white'}}>Social Media:</Title>
                <Text style={{color:'white'}}> Folow us on: </Text>
                <div className="social-media"> 
                <img src={logo1} alt="Facebook" style={{ width: '40px', marginRight: '10px' }} /> 
                <img src={logo2} alt="Instagram" style={{ width: '40px', marginRight: '10px' }} /> 
                <img src={logo3} alt="YouTube" style={{ width: '40px', marginRight: '10px' }} /> 
                </div> 
              </Col>
            </Row> 
          </Footer>
    </Layout>
  );};
export default Home;
