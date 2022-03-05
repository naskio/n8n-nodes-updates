import {IExecuteFunctions} from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWorkflowMetadata,
	INode, IDataObject,
} from 'n8n-workflow';

const hash = require('object-hash');

export class Updates implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Updates',
		name: 'updates',
		icon: 'fa:map-signs',
		group: ['transform'],
		version: 1,
		description: 'Split input into: new items, updated items and old items.',
		defaults: {
			name: 'updates',
			color: '#d25207',
		},
		inputs: ['main'],
		outputs: ['main', 'main', 'main'],
		outputNames: ['new', 'updated', 'old'],
		properties: [
			{
				displayName: 'ID Field',
				name: 'idField',
				type: 'string',
				default: 'id',
				description: 'Field that will be used as identifier (usually "id").',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items: INodeExecutionData[] = this.getInputData();

		const newItems: INodeExecutionData[] = [];
		const updatedItems: INodeExecutionData[] = [];
		const oldItems: INodeExecutionData[] = [];

		const idField = this.getNodeParameter('idField', 0) as string;
		// const mode: WorkflowExecuteMode = this.getMode();
		const workflowMetadata: IWorkflowMetadata = this.getWorkflow();
		const node: INode = this.getNode();

		const staticData = this.getWorkflowStaticData('node'); // static data is stored in the workflow automatically when we have triggers
		staticData.hashesIndex = staticData.hashesIndex || {};
		const hashesIndex = staticData.hashesIndex as IDataObject;

		for (const item of items) {
			const itemJson = item.json;

			const itemKeys = {
				"workflowId": `${workflowMetadata.id}`,
				"nodeName": `${node.name}`, // to enable multiple nodes in the same workflow
				// "workflowActive": workflowMetadata.active, // to get different results when workflow is active or not
				"id": itemJson[idField],
			};
			const itemKeyHash: string = hash(itemKeys);
			const itemHash: string = hash(itemJson);

			if (itemKeyHash in hashesIndex) {
				if (hashesIndex[itemKeyHash] === itemHash) {
					oldItems.push(item);
				} else {
					hashesIndex[itemKeyHash] = itemHash;
					updatedItems.push(item);
				}
			} else {
				hashesIndex[itemKeyHash] = itemHash;
				newItems.push(item);
			}
		}

		return [newItems, updatedItems, oldItems];
	}
}
