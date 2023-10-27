import React, { useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import StepContent from "@mui/material/StepContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const steps = ["接单", "制作", "交付", "完成"];
const TO_BE_ACCEPT = "TO-BE-ACCEPT";
const ACCEPTED = "ACCEPTED";
const PRODUCING = "PRODUCING";
const DELIVERED = "DELIVERED";

const Shop = ({ flowName }: { flowName: string }) => {
  const [activeStep, setActiveStep] = React.useState<number>(-1);
  const [orderStatus, setOrderStatus] = React.useState<string>("");
  const [queryIndex, setQueryIndex] = React.useState<number>(0);
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const queryOrder = async () => {
    const response = await fetch(
      `/get_order_status?flow_name=${encodeURIComponent(flowName)}`
    );
    let out = (await response.text()) as any;
    setOrderStatus(out);

    if (out === TO_BE_ACCEPT) {
      setActiveStep(0);
    } else if (out === ACCEPTED) {
      setActiveStep(1);
    } else if (out === PRODUCING) {
      setActiveStep(2);
    } else if (out == DELIVERED) {
      setActiveStep(3);
    }
  };

  useEffect(() => {
    if (flowName) {
      setTimeout(() => {
        queryOrder();
      }, 1000);
    }

    return () => {};
  }, [flowName, queryIndex]);

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>

              <StepContent>
                {activeStep === 0 && (
                  <>
                    <Typography>收到新订单，请接单。</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={async () => {
                          setSubmitting(true);

                          const response = await fetch(
                            `/start-execution?flow_name=${encodeURIComponent(
                              flowName
                            )}`
                          );
                          let out = (await response.text()) as any;
                          if (out === "OK") {
                            setActiveStep(1);
                            setTimeout(() => {
                              setSubmitting(false);
                            });
                          }
                        }}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        接单
                      </Button>
                    </Box>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Typography>已接单，请制作。</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={async () => {
                          setSubmitting(true);

                          const response = await fetch(
                            `/report-task-succeed?flow_name=${encodeURIComponent(
                              flowName
                            )}`
                          );
                          let out = (await response.text()) as any;
                          if (out === "OK") {
                            setActiveStep(2);
                          }
                          setTimeout(() => {
                            setSubmitting(false);
                          });
                        }}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        去制作
                      </Button>
                    </Box>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <Typography>如果您已经完成制作，请点击去交付。</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={async () => {
                          setSubmitting(true);

                          const response = await fetch(
                            `/report-task-succeed?flow_name=${encodeURIComponent(
                              flowName
                            )}`
                          );
                          let out = (await response.text()) as any;

                          if (out === "OK") {
                            setActiveStep(3);
                          }

                          setTimeout(() => {
                            setSubmitting(false);
                          });
                        }}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        去交付
                      </Button>
                    </Box>
                  </>
                )}
                {activeStep === 3 && (
                  <>
                    <Typography>兑换码已发放！</Typography>
                  </>
                )}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default Shop;
