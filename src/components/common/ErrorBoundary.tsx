"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
	children: React.ReactNode;
	fallbackTitle?: string;
};

type State = {
	hasError: boolean;
};

export default class ErrorBoundary extends React.Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: unknown) {
		console.error("[ErrorBoundary]", error);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="rounded-xl border border-border bg-card p-6 text-center">
					<h3 className="font-heading text-2xl">{this.props.fallbackTitle || "Something went wrong"}</h3>
					<p className="mt-2 text-sm text-muted-foreground">Please retry this action.</p>
					<Button className="mt-4" onClick={() => this.setState({ hasError: false })}>
						Retry
					</Button>
				</div>
			);
		}

		return this.props.children;
	}
}
