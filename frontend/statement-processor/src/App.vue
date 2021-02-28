<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<v-toolbar-title>Statement Processor</v-toolbar-title>
		</v-app-bar>

		<v-main>
			<vue-dropzone id="drop1" :options="dropOptions" @vdropzone-error="uploadFailed"></vue-dropzone>
		</v-main>

		<div class="text-center">
			<v-dialog v-model="dialog" width="500">
				<v-card>
					<v-card-title class="headline grey lighten-2">
						Invalid records
					</v-card-title>

					<v-card-text>
						<v-simple-table>
							<template v-slot:default>
								<thead>
									<tr>
										<th class="text-left">
											Reference
										</th>
										<th class="text-left">
											Description
										</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(val, key) in invalidRecords" :key="key">
										<td>{{ key }}</td>
										<td>{{ val }}</td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
					</v-card-text>

					<v-divider></v-divider>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click="dialog = false">
							Close
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>
	</v-app>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

export default {
	name: 'App',

	components: {
		vueDropzone: vue2Dropzone,
	},

	data: () => ({
		dialog: false,
		dropOptions: {
			url: 'https://s3m49smhq5.execute-api.eu-west-1.amazonaws.com/api/',
			maxFilesize: 0.5,
			parallelUploads: 1,
			acceptedFiles: 'text/csv,text/xml',
		},
		invalidRecords: {},
	}),
	methods: {
		uploadFailed(file, res) {
			// console.log('success', res.invalid);
			file.previewElement.addEventListener('click', () => {
				this.invalidRecords = res.invalid;
				this.dialog = true;
			});
		},
	},
};
</script>

<style>
.dropzone .dz-preview.dz-complete.dz-error .dz-error-message {
  display: none;
}
.dropzone .dz-preview.dz-complete.dz-error .dz-details {
  cursor: pointer;
}
.dropzone .dz-preview.dz-error:hover {
  z-index: initial;
}
.dropzone .dz-preview .dz-success-mark, .dropzone .dz-preview .dz-error-mark {
  z-index: 100;
}
.v-sheet.v-toolbar.v-app-bar {
  z-index: 500;
}
</style>
