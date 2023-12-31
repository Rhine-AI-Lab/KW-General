import React from 'react'
import Style from './App.module.scss'
import M3Style from './theme/material3-theme.module.scss'
import './theme/material3-hook.css'
import {Route, Routes} from "react-router-dom";
import Home from "./Home/Home";
import Chat from "./Chat/Chat";
import Icon from "../compoments/Icon/Icon";
import {Slide} from "@mui/material";
import {TipSnackbar} from "@/compoments/TipSnackbar/TipSnackbar";
import {closeSnackbar, enqueueSnackbar, SnackbarProvider} from "notistack";
import {message, notification} from "antd";
import {IconType, NotificationPlacement} from "antd/es/notification/interface";
import {NoticeType} from "antd/es/message/interface";

function App() {
  return (
    <div className={Style.scale}>
      <div
        className={Style.App}
        onMouseDown={e => {
          e.stopPropagation()
        }}>
        <div className={M3Style.MaterialYou + ' ' + M3Style.Purple + ' ' + Style.theme}>
          <SnackbarProvider maxSnack={5} Components={{
            // @ts-ignore
            tip: TipSnackbar,
          }}>
            <Routes>
              <Route path="/home" element={<Home/>} />
              <Route path="/" element={<Chat/>} />
            </Routes>
          </SnackbarProvider>
        </div>
      </div>
    </div>
  )
}

export default App;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line
    interface IntrinsicElements {
      [tag: string]: any
    }
  }
}

export const tip = (text: string, type = 'default') => {
  const action = <React.Fragment>
    <span className={Style.closeBtn}>
      <Icon size='20px' onClick={e => closeSnackbar()}>close</Icon>
    </span>
  </React.Fragment>
  // type = 'tip'
  enqueueSnackbar(text, {
    variant:type as any,
    autoHideDuration: 1200,
    anchorOrigin: { vertical: 'right', horizontal: 'bottom' },
    TransitionComponent: (props: any) => <Slide {...props} direction="left" />,
    action: action
  })
}

declare module "notistack" {
  interface VariantOverrides {
    tip: true;
  }
}

export class AppTools {
  static notify = (
    title: string,
    message = "",
    type: IconType = "info",
    placement: NotificationPlacement = "top"
  ) => {
    notification.open({
      message: title,
      description: message,
      onClick: () => {
      },
      type: type,
      duration: 1,
    });
  }

  static message = (
    title: string,
    type: NoticeType = "info",
    duration: number = 2,
  ) => {
    message.open({
      type: type,
      content: title,
      duration: duration,
    });
  }
}
