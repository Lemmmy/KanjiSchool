// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Divider } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import { AppLoading } from "@global/AppLoading";
import { PageLayout } from "@layout/PageLayout";

import * as api from "@api";

import { ExtLink } from "@comp/ExtLink";
import { DemoCarousel } from "./DemoCarousel";
import { AttributionFooter } from "@layout/AttributionFooter.tsx";

const UUID_RE = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

interface FormValues {
  apiKey: string;
}

export function LoginPage(): JSX.Element {
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const [form] = Form.useForm<FormValues>();

  const { md } = useBreakpoint();

  async function onSubmit() {
    const values = await form.validateFields();

    try {
      // Attempt to log in. If it's successful, save the API key.
      setLoggingIn(true);
      setLoginFailed(false);

      await api.attemptLogIn(values.apiKey);
    } catch (err: any) {
      console.error("login failed:", err);
      setLoginFailed(true);
    } finally {
      setLoggingIn(false);
    }
  }

  // Logging in screen preloader
  if (loggingIn) {
    return <AppLoading title="Logging in..." />;
  }

  // Actually show the login page
  return <PageLayout
    siteTitle="Log in"
    noHeader
    verticallyCentered
    contentsHeightClassName="h-auto min-h-screen"
  >
    <Card title="KanjiSchool" className="min-w-[300px] w-full max-w-[720px] box-border">
      {/* Top section - lead text and carousel */}
      <Row>
        {/* Lead text */}
        <Col flex="1">
          <p className="mt-0 text-justify">
            Welcome to KanjiSchool, a client for <ExtLink href="https://www.wanikani.com">WaniKani</ExtLink>, an SRS
            kanji learning app created by <ExtLink href="https://www.tofugu.com">Tofugu</ExtLink>.
          </p>

          <p className="mb-0 text-justify">
            The client is fully-featured and supports additional
            functionality such as self-study reviews, mobile support, and
            offline mode.
          </p>
        </Col>

        {/* Carousel on widescreen */}
        {md && <Col flex="200px">
          <DemoCarousel />
        </Col>}
      </Row>

      <Divider />

      {/* Onboarding */}
      <p className="text-justify">
        To get started, enter your <ExtLink href="https://www.wanikani.com/settings/personal_access_tokens">WaniKani
        API v2 key</ExtLink>.
        Permissions required:
      </p>

      <ul className="mt-0 grid grid-cols-1 md:grid-cols-2 gap-0.5 md:gap-xs">
        <li><code>assignments:start</code></li>
        <li><code>reviews:create</code></li>
        <li><code>study_materials:create</code></li>
        <li><code>study_materials:update</code></li>
      </ul>

      <p className="text-desc text-justify">
        If you don&apos;t have a WaniKani account yet, create
        one <ExtLink href="https://www.wanikani.com">here</ExtLink>.
      </p>

      <Form
        form={form}
        layout="inline"
        initialValues={{ apiKey: "" }}
        onFinish={onSubmit}
        className="w-full"
      >
        {/* Fake username for autofill */}
        <Input
          type="username"
          id="username"
          name="username"
          autoComplete="username"
          value="WaniKani API Key"
          className="absolute pointer-events-none opacity-0"
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

          className="!flex-1 !mie-0 md:!mie-md basis-full md:basis-auto
            [&_.ant-form-item-label]:hidden md:[&_.ant-form-item-label]:block"
        >
          <Input
            type="password"
            name="apiKey"
            placeholder="API Key"
            autoComplete="current-password"
          />
        </Form.Item>

        {/* Submit button */}
        <Button
          type="primary"
          onClick={onSubmit}
          className="basis-full mt-sm md:basis-auto md:mt-0"
        >
          Log in
        </Button>
      </Form>

      {/* Carousel on mobile */}
      {!md && <>
        <Divider />
        <Row className="mt-lg justify-center">
          <Col><DemoCarousel /></Col>
        </Row>
      </>}
    </Card>

    {/* Footer */}
    <AttributionFooter
      withThemeToggle
      className="max-w-[720px] mt-5 mx-auto"
    />
  </PageLayout>;
}
