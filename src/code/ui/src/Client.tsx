import React, { useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const steps = ["下单", "待接单", "已接单", "制作中", "完成"];
const TO_BE_ACCEPT = "TO-BE-ACCEPT";
const ACCEPTED = "ACCEPTED";
const PRODUCING = "PRODUCING";
const DELIVERED = "DELIVERED";

function isNumber(val: string) {
  var regPos = /^\d+(\.\d+)?$/;
  var regNeg =
    /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

const Client = ({ setFlowName: setOuterFlowName }: { setFlowName: any }) => {
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [flowName, setFlowName] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");
  const [showError, setShowError] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [orderStatus, setOrderStatus] = React.useState<string>("");
  const [queryIndex, setQueryIndex] = React.useState<number>(0);
  const [giftCode, setGiftCode] = React.useState<string>("");

  const generateGiftCode = async () => {
    await fetch(
      `/report-task-succeed?flow_name=${encodeURIComponent(flowName)}`
    );

    await fetch(
      `/set_status?flow_name=${encodeURIComponent(flowName)}&status=FINISHED`,
      {
        headers: {
          "X-FnF-Http-Callback-Task-Token": "end-token",
        },
      }
    );

    const response = await fetch(
      `/generate_gift_code?flow_name=${encodeURIComponent(flowName)}`
    );

    let out = (await response.text()) as any;
    setGiftCode(isNumber(out) ? `兑换码为 ${out}` : out);
    window.startConfetti();
    setTimeout(() => {
      window.stopConfetti();
    }, 5000);
  };

  const queryOrder = async () => {
    try {
      const response = await fetch(
        `/get_order_status?flow_name=${encodeURIComponent(flowName)}`
      );
      let out = (await response.text()) as any;
      setOrderStatus(out);
    } catch (error) {}

    setQueryIndex(queryIndex + 1);
  };

  useEffect(() => {
    if (orderStatus === TO_BE_ACCEPT) {
      setActiveStep(1);
    } else if (orderStatus === ACCEPTED) {
      setActiveStep(2);
    } else if (orderStatus === PRODUCING) {
      setActiveStep(3);
    } else if (orderStatus === DELIVERED) {
      setActiveStep(4);
    }

    if (submitted && flowName && orderStatus !== DELIVERED) {
      setTimeout(() => {
        queryOrder();
      }, 1000);
    }

    return () => {};
  }, [queryIndex]);

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {activeStep === 0 && (
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <TextField
                        onChange={(e) => {
                          setShowError(false);
                          setFlowName(e.target.value.trim());
                        }}
                        spellCheck={false}
                        value={flowName}
                        disabled={submitting}
                        required
                        helperText={
                          showError ? errorText : "请输入工作流名称。"
                        }
                        label="工作流名称"
                        error={showError}
                        variant="standard"
                        name={Date.now().toString()}
                      />
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          disabled={submitting}
                          onClick={async () => {
                            if (!flowName) {
                              setShowError(true);
                              setErrorText("请输入工作流名称");
                            } else {
                              setSubmitting(true);
                              const response = await fetch(
                                `/check-flow-exist?flow_name=${encodeURIComponent(
                                  flowName
                                )}`
                              );
                              let out = (await response.text()) as any;

                              if (out === "true") {
                                await fetch(
                                  `/set_status?flow_name=${encodeURIComponent(
                                    flowName
                                  )}&status=TO-BE-ACCEPT`,
                                  {
                                    headers: {
                                      "X-FnF-Http-Callback-Task-Token":
                                        "init-token",
                                    },
                                  }
                                );

                                setOuterFlowName(flowName);
                                setSubmitted(true);
                                setActiveStep(1);
                                queryOrder();
                              } else {
                                setShowError(true);
                                setErrorText(
                                  "您输入的工作流不存在，请检查工作流名称。"
                                );
                              }

                              setSubmitting(false);
                            }
                          }}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          下单
                        </Button>
                      </Box>
                    </div>
                  </Box>
                )}
                {activeStep === 1 && (
                  <Typography>等待商家接单，请稍后。</Typography>
                )}
                {activeStep === 2 && (
                  <Typography>商家已接单，请稍后。</Typography>
                )}
                {activeStep === 3 && (
                  <Typography>商家正在进行制作，请稍后。</Typography>
                )}
                {activeStep === 4 && (
                  <>
                    {giftCode ? (
                      <Typography>{giftCode}</Typography>
                    ) : (
                      <>
                        <Typography>
                          订单已经制作完成，请使用兑换码领取咖啡。
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant="contained"
                            disabled={submitting}
                            onClick={async () => {
                              setSubmitting(true);
                              generateGiftCode();
                              setSubmitting(false);
                            }}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            查看兑换码
                          </Button>
                        </Box>
                      </>
                    )}
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

export default Client;
