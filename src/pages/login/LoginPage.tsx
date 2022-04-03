// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState } from "react";
import { Form, Input, Button, Card, Row, Col } from "antd";

import { AppLoading } from "@global/AppLoading";
import { PageLayout } from "@layout/PageLayout";

import * as api from "@api";

import { criticalError, useTimeout } from "@utils";

const UUID_RE = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

interface FormValues {
  apiKey: string;
}

export function LoginPage(): JSX.Element {
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const [takingLong, setTakingLong] = useState(false);

  const [form] = Form.useForm<FormValues>();

  async function onSubmit() {
    const values = await form.validateFields();

    try {
      // Attempt to log in. If it's successful, save the API key.
      setLoggingIn(true);
      setLoginFailed(false);
      await api.attemptLogIn(values.apiKey);
    } catch (err) {
      criticalError(err);
      setLoginFailed(true);
    } finally {
      setLoggingIn(false);
    }
  }

  // If we're logging in and it's taking a while, show an extra message
  useTimeout(() => setTakingLong(true), 3000);

  // Show a pre-loader or an error if we're already logged in
  if (loggingIn) {
    // Logging in screen
    return <AppLoading
      title="Logging in..."

      // If it takes more than 3 seconds to log in, show an extra message
      extra={takingLong && <>
        If you are having trouble logging in, please create an issue on
        <a href="https://github.com/Lemmmy/KanjiSchool" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </>}

      // 64px margin because this is wrapped in AppLayout, so we need to push
      // the preloader down a bit to accommodate for the missing nav bar
      style={{ marginTop: 64 }}
    />;
  }

  // Actually show the login page
  return <PageLayout siteTitle="Log in" noHeader>
    <Row justify="center" align="middle" style={{ height: "100%" }}>
      <Col>
        <Card title="Log in" style={{ minWidth: 512 }}>
          <Form
            form={form}
            initialValues={{ apiKey: "" }}
            onFinish={onSubmit}
          >
            {/* Fake username for autofill */}
            <Input
              type="username"
              id="username" name="username"
              value="API Key"
              style={{ position: "absolute", pointerEvents: "none", opacity: 0 }}
            />

            {/* API key */}
            <Form.Item
              name="apiKey"
              label="API Key"
              required
              rules={[{
                pattern: UUID_RE,
                message: "Must be a valid API key"
              }]}

              // Show an error if the login failed
              validateStatus={loginFailed ? "error" : undefined}
              help={loginFailed
                ? "Login failed, incorrect API key?"
                : undefined}
            >
              <Input
                type="password"
                placeholder="API Key"
              />
            </Form.Item>

            {/* Submit button */}
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={onSubmit}
            >
              Log in
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  </PageLayout>;
}
