import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Client from "./Client";
import { Box } from "@mui/material";
import Shop from "./Shop";

export default function App() {
  const [flowName, setFlowName] = React.useState<string>("");

  return (
    <>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>

      <Grid container spacing={2}>
        <Grid xs={6}>
          <Container>
            <Card sx={{ my: 4, mx: 4 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  image="/yunqi.jpg"
                  alt="yunqi"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    用户端
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    在此处模拟用户完成下单流程并获取兑换码。您可以在
                    <a
                      href="https://fnf.console.aliyun.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      云工作流 CloudFlow 控制台
                    </a>
                    找到您创建的工作流名称。
                  </Typography>
                  <Box sx={{ my: 4 }}>
                    <Client setFlowName={setFlowName} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Container>
        </Grid>
        <Grid xs={6}>
          <Container>
            <Card sx={{ my: 4, mx: 4 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  image="/shop.png"
                  alt="coffee shop"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    商家端
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    在此处模拟商家完成接单，制作和交付流程。您可以在
                    <a
                      href="https://fnf.console.aliyun.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      云工作流 CloudFlow 控制台
                    </a>
                    查看工作流的具体执行详情。
                  </Typography>
                  <Box sx={{ my: 4 }}>
                    <Shop flowName={flowName} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}
