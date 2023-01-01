import logo from './logo.svg';
import './App.css';
import isElectron from 'is-electron';
import {Alert, Button, CardActionArea, CardActions, Paper, Tooltip} from '@mui/material';
import {useFilePicker} from "use-file-picker";
import {useEffect, useState} from "react";

function App() {
  const [JLinkExe,setJlinkExe] = useState('');
  const [BootloaderBin,setBootloaderBin] = useState('');
  const [SectorTableBin,setSectorTableBin] = useState('');
  const [AppBin,setAppBin] = useState('');

  // useEffect(()=>{},[]);

  var Name = "Not known";
  if (navigator.appVersion.indexOf("Win") !== -1) Name =
      "Windows OS";
  if (navigator.appVersion.indexOf("Mac") !== -1) Name =
      "MacOS";
  if (navigator.appVersion.indexOf("X11") !== -1) Name =
      "UNIX OS";
  if (navigator.appVersion.indexOf("Linux") !== -1) Name =
      "Linux OS";
  console.log(Name);
  console.log('Is electron' + isElectron());
  let buttonTitle;
  if (JLinkExe.length <= 1)
    buttonTitle = '请选择JLinkEXE的路径';
  else
    buttonTitle = '点击以烧录';
  return (
    <div className="App">
      <header className="App-header">
        <JlinkExePicker SetJlinkExe={setJlinkExe}/>
        <p>{JLinkExe}</p>
        <BootloaderBinPicker SetBootloaderBin={setBootloaderBin}/>
        <p>{BootloaderBin}</p>
        <SectorTableBinPicker SetSectorTableBin={setSectorTableBin}/>
        <p>{SectorTableBin}</p>
        <AppBinPicker SetAppBin={setAppBin}/>
        <p>{AppBin}</p>
        <Tooltip title={buttonTitle}>
          <span><Button disabled={JLinkExe.length <= 1} variant={'contained'} onClick={
            () => {
              window.electronAPI.runJlink({
                jlinkexe:JLinkExe,
                bootloader_bin:BootloaderBin,
                sector_table_bin:SectorTableBin,
                app_bin:AppBin,
              });
              // console.log(plainFiles[0].path)
              // const filePath = await window.electronAPI.openFile();
              // console.log(filePath);
            }
          }>Press Me</Button></span>
        </Tooltip>
      </header>
    </div>
  );
}

function JlinkExePicker(props){
  const [JLinkExeSelector, { filesContent, loading, plainFiles }] = useFilePicker({
    accept: '.exe',
    readFilesContent: false
  });
  if (plainFiles[0])
    props.SetJlinkExe(plainFiles[0].path)
  return(
      <>
        <Button onClick={() => JLinkExeSelector()}>Select JLinkExe</Button>
      </>
  )
}

function BootloaderBinPicker(props){
  const [BootloaderBinSelector, { filesContent, loading, plainFiles }] = useFilePicker({
    accept: '.hex',
    readFilesContent: false
  });
  if (plainFiles[0])
    props.SetBootloaderBin(plainFiles[0].path)
  return(
      <>
        <Button onClick={() => BootloaderBinSelector()}>Select BootloaderBin</Button>
      </>
  )
}

function SectorTableBinPicker(props){
  const [SectorTableBinSelector, { filesContent, loading, plainFiles }] = useFilePicker({
    accept: '.hex',
    readFilesContent: false
  });
  if (plainFiles[0])
    props.SetSectorTableBin(plainFiles[0].path)
  return(
      <>
        <Button onClick={() => SectorTableBinSelector()}>Select SectorTableBin</Button>
      </>
  )
}

function AppBinPicker(props){
  const [AppBinSelector, { filesContent, loading, plainFiles }] = useFilePicker({
    accept: '.hex',
    readFilesContent: false
  });
  if (plainFiles[0])
    props.SetAppBin(plainFiles[0].path)
  return(
      <>
        <Button onClick={() => AppBinSelector()}>Select AppBinSelector</Button>
      </>
  )
}

export default App;
