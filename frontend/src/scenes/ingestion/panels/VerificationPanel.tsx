import React, { useState } from 'react'
import { useActions, useValues } from 'kea'
import { useInterval } from 'lib/hooks/useInterval'
import { CardContainer } from 'scenes/ingestion/CardContainer'
import { Button, Row, Spin, Space, Popconfirm, Dropdown, Menu, Typography } from 'antd'
import { ingestionLogic } from 'scenes/ingestion/ingestionLogic'
import { DownOutlined, SlackSquareOutlined, ReadOutlined } from '@ant-design/icons'
import { CreateInviteModalWithButton } from 'scenes/organization/Settings/CreateInviteModal'

const { Text } = Typography
import { featureFlagLogic } from 'lib/logic/featureFlagLogic'
import { FEATURE_FLAGS } from 'lib/constants'
import { teamLogic } from 'scenes/teamLogic'

export function VerificationPanel(): JSX.Element {
    const { loadCurrentTeam } = useActions(teamLogic)
    const { currentTeam } = useValues(teamLogic)
    const { setVerify, completeOnboarding } = useActions(ingestionLogic)
    const { index, totalSteps } = useValues(ingestionLogic)
    const { featureFlags } = useValues(featureFlagLogic)
    const [isPopConfirmShowing, setPopConfirmShowing] = useState(false)
    const [isHelpMenuShowing, setHelpMenuShowing] = useState(false)

    useInterval(() => {
        if (!currentTeam?.ingested_event && !isPopConfirmShowing && !isHelpMenuShowing) {
            loadCurrentTeam()
        }
    }, 2000)

    function HelperButtonRow(): JSX.Element {
        function HelpButton(): JSX.Element {
            const menu = (
                <Menu selectable>
                    <Menu.Item key="0" data-attr="ingestion-help-item-docs">
                        <a
                            href="https://posthog.com/docs/integrate/ingest-live-data"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button type="link">
                                <ReadOutlined />
                                Read the docs
                            </Button>
                        </a>
                    </Menu.Item>
                    <Menu.Item key="1" data-attr="ingestion-help-item-invite">
                        <CreateInviteModalWithButton type="link" />
                    </Menu.Item>
                    <Menu.Item key="2" data-attr="ingestion-help-item-slack">
                        <a href="https://posthog.com/slack?s=app" target="_blank" rel="noopener noreferrer">
                            <Button type="link">
                                <SlackSquareOutlined />
                                Ask us in Slack
                            </Button>
                        </a>
                    </Menu.Item>
                </Menu>
            )
            return (
                <Dropdown
                    overlay={menu}
                    trigger={['click']}
                    visible={isHelpMenuShowing}
                    onVisibleChange={(v) => {
                        setHelpMenuShowing(v)
                    }}
                >
                    <Button type="primary" data-attr="ingestion-help-button" onClick={() => setHelpMenuShowing(true)}>
                        Need help? <DownOutlined />
                    </Button>
                </Dropdown>
            )
        }

        const popoverTitle = (
            <Space direction="vertical">
                <Text strong>Are you sure you want to continue without data?</Text>
                <Text>You won't be able to conduct analysis or use most tools without event data.</Text>
                <Text>For the best experience, we recommend adding event data before continuing.</Text>
            </Space>
        )
        return (
            <Space style={{ float: 'right' }}>
                <Popconfirm
                    title={popoverTitle}
                    okText="Yes, I know what I'm doing."
                    okType="danger"
                    cancelText="No, go back."
                    onVisibleChange={(v) => {
                        setPopConfirmShowing(v)
                    }}
                    onCancel={() => {
                        setPopConfirmShowing(false)
                    }}
                    visible={isPopConfirmShowing}
                    onConfirm={completeOnboarding}
                    cancelButtonProps={{ type: 'primary' }}
                >
                    <Button
                        type="dashed"
                        data-attr="ingestion-continue-anyway"
                        onClick={() => {
                            setPopConfirmShowing(true)
                        }}
                    >
                        Continue without verifying
                    </Button>
                </Popconfirm>
                <HelpButton />
            </Space>
        )
    }

    function DefaultSkipCta(): JSX.Element {
        return (
            <b
                data-attr="wizard-complete-button"
                style={{ float: 'right' }}
                className="button-border clickable"
                onClick={completeOnboarding}
            >
                Continue without verifying
            </b>
        )
    }

    return (
        <CardContainer index={index} totalSteps={totalSteps} onBack={() => setVerify(false)}>
            {!currentTeam?.ingested_event ? (
                <>
                    <Row align="middle">
                        <Spin />
                        <h2 className="ml-3">Listening for events!</h2>
                    </Row>
                    <p className="prompt-text">
                        {' '}
                        Once you have integrated the snippet and sent an event, we will verify it sent properly and
                        continue.
                    </p>
                    {featureFlags[FEATURE_FLAGS.INGESTION_HELP_BUTTON] ? <HelperButtonRow /> : <DefaultSkipCta />}
                </>
            ) : (
                <>
                    <h2>Successfully sent events!</h2>
                    <p className="prompt-text">
                        You will now be able to explore PostHog and take advantage of all its features to understand
                        your users.
                    </p>
                    <Button
                        data-attr="wizard-complete-button"
                        type="primary"
                        style={{ float: 'right' }}
                        onClick={completeOnboarding}
                    >
                        Complete
                    </Button>
                </>
            )}
        </CardContainer>
    )
}
