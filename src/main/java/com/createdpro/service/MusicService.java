package com.createdpro.service;

import com.createdpro.vo.JsonResult;
import com.createdpro.vo.PathConf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class MusicService {

    @Autowired
    private PathConf pathConf;

    /**
     *
     * @param name
     * @return
     */
    public byte[] getMusic(String name) {
        String MUSIC_PATH = pathConf.getConf().getMUSIC_PATH();
        File music = new File(MUSIC_PATH, name);
        if (!music.exists()) {
            return null;
        }
        byte[] buffer = null;
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            FileInputStream input = new FileInputStream(music);
            byte[] b = new byte[1024];
            int length;
            while ((length = input.read(b)) != -1){
                output.write(b, 0, length);
            }
            buffer = output.toByteArray();
            output.close();
            input.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return buffer;
    }

    // 返回音乐列表
    // TODO （后续会添加图片列表，歌词列表）
    public JsonResult getList(){
        String MUSIC_PATH = pathConf.getConf().getMUSIC_PATH();
        File path = new File(MUSIC_PATH);
        List<String> fileList = new ArrayList<>();
        if (! path.exists()) {
            return JsonResult.error(1, new RuntimeException("歌曲目录不存在"));
        }
        // 查找
        File[] files = path.listFiles();
        for (File file : files) {
            fileList.add(file.getName());
        }
        return JsonResult.success(fileList);
    }

}
