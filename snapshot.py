import cv2
import random

def snapshot_random_frames(video_path, num_frames, output_dir):
    # Open the video file
    video = cv2.VideoCapture(video_path)
    
    # Get the total number of frames in the video
    total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Generate random frame indices
    frame_indices = random.sample(range(total_frames), num_frames)
    
    # Read the video and save the selected frames
    for frame_index in frame_indices:
        # Set the frame index
        video.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        
        # Read the frame
        ret, frame = video.read()
        
        # Check if the frame was successfully read
        if ret:
            # Generate a unique filename for the frame
            output_path = f'{output_dir}/frame_{frame_index}.jpg'
            
            # Save the frame as an image
            cv2.imwrite(output_path, frame)
            print(f'Saved frame {frame_index} as {output_path}')
    
    # Release the video object
    video.release()

# Example usage
video_path = 'Fast_X.mp4'
num_frames = 5
output_dir = 'snapshots'

snapshot_random_frames(video_path, num_frames, output_dir)
