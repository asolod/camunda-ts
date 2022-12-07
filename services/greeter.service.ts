"use strict";

import {Service, ServiceBroker, Context} from "moleculer";
import { Client, logger } from "camunda-external-task-client-js";

export default class GreeterService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "greeter",
			actions:{
				/**
				 * Say a 'Hello' action.
				 *
				 */
				hello: {
					rest: {
						method: "GET",
						path: "/hello",
					},
					async handler(): Promise<string> {
						const config = {baseUrl: "http://localhost:8080/engine-rest", use: logger};
						const client = new Client(config);
						client.subscribe("creditScoreChecker", async function ({task, taskService}) {
							// Put your business logic
							// complete the task
							await taskService.complete(task);
						});
						return this.ActionHello();
					},
				},

				/**
				 * Welcome, a username
				 */
				welcome: {
					rest: "/welcome",
					params: {
						name: "string",
					},
					async handler(ctx: Context<{name: string}>): Promise<string> {
						return this.ActionWelcome(ctx.params.name);
					},
				},
			},
		});
	}

	// Action
	public ActionHello(): string {
		return "Hello Moleculer";
	}

	public ActionWelcome(name: string): string {
		return `Welcome, ${name}`;
	}
}
