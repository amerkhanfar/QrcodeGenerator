import Head from "next/head";
import QRCode from "react-qr-code";
import axios from "axios";
import styled from "styled-components";
import { useState, useEffect } from "react";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #35224c;
  flex-direction: column;
`;

export const LogoContainer = styled.div`
  width: 100vw;
  height: fit-content;
  display: flex;
  justify-content: center;
  background-color: #35224c;
  margin-top: 30px;
`;

export const ContentContainer = styled.div`
  width: 100vw;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background-color: #35224c;
  margin-top: 30px;
`;

export const QrContainer = styled.div`
  width: 100vw;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  background-color: #35224c;
  margin-top: 30px;
`;
export const Logo = styled.div`
  background-image: url("/white.png");
  width: 160px;
  height: 110px;
  background-size: cover;
`;

export const SelectInput = styled.select`
  width: 200px;
  height: 50px;
  font-size: 14px;
  background-color: white;
  color: black;
  border-radius: 5px;
`;

export const SubmitButton = styled.button`
  width: 50px;
  color: white;
  background-color: red;
  border: none;
  outline: none;
  height: 30px;
  border-radius: 5px;
`;

export const PointsInput = styled.input`
  padding: 10px;
  background-color: white;
  color: black;
`;

export default function Home() {
  const [step, setStep] = useState(true);
  const [value, setValue] = useState(0);
  const [standId, setStandId] = useState(null);
  const [standName, setStandName] = useState("");
  const [AllStands, setAllStands] = useState([]);

  const handleChange = (e) => {
    let value = e.target.value;
    value = value ? JSON.parse(value) : null;
    console.log(value);
    setStandName(value.standName);
    setStandId(value.standid);
  };
  const fetchStands = async () => {
    try {
      const response = await axios.get(
        "https://oplus.dev/apps/dw_game/api/all-stages/djALCHttVf6jAmgOyNZnlXSdM",
      );
      setAllStands(response.data.stages);
      console.log(response.data.stages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStands();
  }, []);

  return (
    <div>
      <Head>
        <title>QR CODE</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'></meta>
      </Head>

      <Container>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        {step ? (
          <ContentContainer>
            <h1 style={{ color: "white" }}>Choose A Stand</h1>
            <SelectInput onChange={handleChange}>
              <option
                value=''
                disabled
                selected
                hidden
                style={{ color: "white" }}>
                Please Choose A Stand
              </option>
              {AllStands.map((stand) => {
                return (
                  <option
                    key={stand.id}
                    value={`{"standid" : "${stand.slug}" ,"standName" :"${stand.title}"}`}>
                    {stand.title}
                  </option>
                );
              })}
            </SelectInput>

            <SubmitButton
              onClick={() => {
                setStep(!step);
              }}>
              Next
            </SubmitButton>
          </ContentContainer>
        ) : (
          <QrContainer>
            <h2 style={{ color: "white" }}>How Many Points</h2>

            <div
              onClick={() => {
                setStep(!step);
              }}
              style={{
                position: "absolute",
                color: "white",
                fontSize: "40px",
                left: "20px",
                top: "20px",
                fontWeight: "bold",
              }}>
              ←
            </div>

            {standName ? (
              <p
                style={{
                  position: "absolute",
                  color: "white",
                  left: "50%",
                  transform: "translateX(-50%)",
                  bottom: "20px",
                }}>
                You Are In {standName} stand
              </p>
            ) : null}

            <PointsInput
              type='number'
              onChange={(e) => setValue(e.target.value)}
              placeholder='Points'
            />

            {value ? (
              <div
                style={{
                  background: "white",
                  width: "280px",
                  height: "300px",
                  display: "flex",
                  padding: "20px",
                  justifyContent: "center",
                  borderRadius: "10px",
                  alignItems: "center",
                }}>
                <QRCode
                  style={{
                    height: "200px",
                    width: "200px",
                  }}
                  value={`https://dpworld.vercel.app/direct/${value}/${standId}`}
                  fgColor='black'
                  bgColor='white'
                />
              </div>
            ) : null}
          </QrContainer>
        )}
      </Container>
    </div>
  );
}
